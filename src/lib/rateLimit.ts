/**
 * Rate Limiting Middleware
 * 
 * IP-based rate limiting to prevent:
 * - Brute force attacks
 * - DDoS attacks
 * - API abuse
 * - Email spam
 * 
 * @module lib/rateLimit
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (production'da Redis kullanın!)
const store: RateLimitStore = {};

// Cleanup eski kayıtları (her 1 saatte)
// Store the interval id so tests can clear it and allow process exit
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
let cleanupInterval: ReturnType<typeof setInterval> | null = setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, CLEANUP_INTERVAL_MS);

/**
 * Stop the internal cleanup interval. Useful for tests to avoid open handles.
 */
export function stopRateLimitCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval as ReturnType<typeof setInterval>);
    cleanupInterval = null;
  }
}

export interface RateLimitConfig {
  maxRequests: number;  // İzin verilen maksimum istek sayısı
  windowMs: number;     // Zaman penceresi (milliseconds)
  message?: string;     // Özel hata mesajı
  skipSuccessfulRequests?: boolean; // Başarılı istekleri sayma
}

/**
 * Rate limit presets for different endpoints
 */
export const RATE_LIMITS = {
  // Auth endpoints - Brute force önleme
  AUTH_STRICT: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 dakika
    message: 'Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin.',
  },
  
  // Email gönderme - Spam önleme
  EMAIL_SEND: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 saat
    message: 'Çok fazla email gönderme talebi. 1 saat sonra tekrar deneyin.',
  },
  
  // CV işlemleri - Abuse önleme
  CV_OPERATIONS: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 dakika
    message: 'Çok fazla işlem yapıyorsunuz. Lütfen bekleyin.',
  },
  
  // Profil güncellemeleri
  PROFILE_UPDATE: {
    maxRequests: 5,
    windowMs: 5 * 60 * 1000, // 5 dakika
    message: 'Çok fazla güncelleme isteği. 5 dakika bekleyin.',
  },
  
  // Genel API limiti
  API_GENERAL: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 dakika
    message: 'Çok fazla istek. Lütfen yavaşlayın.',
  },
  
  // Şifre değiştirme
  PASSWORD_CHANGE: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 saat
    message: 'Çok fazla şifre değiştirme denemesi. 1 saat bekleyin.',
  },
} as const;

/**
 * Get client identifier (IP address)
 */
function getClientIdentifier(req: NextRequest): string {
  // Try to get real IP from headers (if behind proxy)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to localhost in development
  return 'localhost';
}

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const identifier = getClientIdentifier(req);
  const key = `${identifier}:${req.nextUrl.pathname}`;
  const now = Date.now();
  
  // Get or create rate limit entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + config.windowMs,
    };
  }
  
  const entry = store[key];
  const allowed = entry.count < config.maxRequests;
  
  if (allowed) {
    entry.count++;
  }
  
  const remaining = Math.max(0, config.maxRequests - entry.count);
  
  // Log rate limit violations
  if (!allowed) {
    logger.warn('Rate limit exceeded', {
      ip: identifier,
      endpoint: req.nextUrl.pathname,
      count: entry.count,
      limit: config.maxRequests,
    });
  }
  
  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit middleware wrapper
 * 
 * @example
 * export async function POST(req: NextRequest) {
 *   const rateLimitResult = rateLimit(req, RATE_LIMITS.AUTH_STRICT);
 *   if (rateLimitResult) return rateLimitResult;
 *   
 *   // Continue with request handling...
 * }
 */
export function rateLimit(
  req: NextRequest,
  config: RateLimitConfig
): NextResponse | null {
  const result = checkRateLimit(req, config);
  
  if (!result.allowed) {
    const resetDate = new Date(result.resetTime);
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    
    return NextResponse.json(
      {
        error: config.message || 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.',
        retryAfter,
        resetTime: resetDate.toISOString(),
      },
      {
        status: 429, // Too Many Requests
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': resetDate.toISOString(),
        },
      }
    );
  }
  
  // Request allowed - add rate limit headers
  return null;
}

/**
 * Get rate limit info without incrementing counter
 */
export function getRateLimitInfo(
  req: NextRequest,
  config: RateLimitConfig
): { remaining: number; resetTime: number; limit: number } {
  const identifier = getClientIdentifier(req);
  const key = `${identifier}:${req.nextUrl.pathname}`;
  const now = Date.now();
  
  if (!store[key] || store[key].resetTime < now) {
    return {
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
      limit: config.maxRequests,
    };
  }
  
  const entry = store[key];
  return {
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetTime: entry.resetTime,
    limit: config.maxRequests,
  };
}

/**
 * Reset rate limit for specific identifier (admin function)
 */
export function resetRateLimit(identifier: string, pathname: string): void {
  const key = `${identifier}:${pathname}`;
  delete store[key];
  logger.info('Rate limit reset', { identifier, pathname });
}

/**
 * Clear all rate limits (admin function)
 */
export function clearAllRateLimits(): void {
  Object.keys(store).forEach(key => delete store[key]);
  logger.info('All rate limits cleared');
}

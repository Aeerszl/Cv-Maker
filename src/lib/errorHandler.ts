/**
 * Error Handling Middleware
 * 
 * Centralized error handling to prevent information leakage
 * in production environments.
 * 
 * @module lib/errorHandler
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * Error types for better categorization
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_API = 'EXTERNAL_API_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
}

/**
 * Custom Application Error
 */
export class AppError extends Error {
  type: ErrorType;
  statusCode: number;
  isOperational: boolean;
  context?: Record<string, unknown>;

  constructor(
    message: string,
    type: ErrorType = ErrorType.INTERNAL,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  error: string;
  type?: string;
  code?: string;
  timestamp?: string;
  requestId?: string;
}

/**
 * Get user-friendly error message based on error type
 */
function getUserFriendlyMessage(error: AppError | Error): string {
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.VALIDATION:
        return error.message;
      case ErrorType.AUTHENTICATION:
        return 'Kimlik doğrulama başarısız. Lütfen giriş yapın.';
      case ErrorType.AUTHORIZATION:
        return 'Bu işlem için yetkiniz yok.';
      case ErrorType.NOT_FOUND:
        return 'İstenen kaynak bulunamadı.';
      case ErrorType.CONFLICT:
        return error.message;
      case ErrorType.RATE_LIMIT:
        return 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.';
      case ErrorType.DATABASE:
        return 'Veritabanı işlemi başarısız. Lütfen tekrar deneyin.';
      case ErrorType.EXTERNAL_API:
        return 'Dış servis yanıt vermiyor. Lütfen tekrar deneyin.';
      default:
        return 'Bir hata oluştu. Lütfen tekrar deneyin.';
    }
  }
  
  // Generic error - don't expose details
  return 'Bir hata oluştu. Lütfen tekrar deneyin.';
}

/**
 * Get status code for error
 */
function getStatusCode(error: AppError | Error): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  
  // Default to 500 for unknown errors
  return 500;
}

/**
 * Central error handler
 * 
 * Usage:
 * ```typescript
 * try {
 *   // ... code
 * } catch (error) {
 *   return handleError(error, 'CV creation failed', { userId, cvId });
 * }
 * ```
 */
export function handleError(
  error: unknown,
  context?: string,
  additionalContext?: Record<string, unknown>
): NextResponse {
  // Convert to Error if needed
  const err = error instanceof Error ? error : new Error(String(error));
  
  // Log the error with full details (for debugging)
  logger.error(context || 'Error occurred', {
    error: err.message,
    stack: err.stack,
    type: err instanceof AppError ? err.type : 'UNKNOWN',
    ...additionalContext,
  });

  // Determine status code
  const statusCode = getStatusCode(err);
  
  // Build response (NEVER expose stack trace or internal details in production!)
  const response: ErrorResponse = {
    error: getUserFriendlyMessage(err),
    timestamp: new Date().toISOString(),
  };
  
  // Only add error type in development
  if (process.env.NODE_ENV === 'development' && err instanceof AppError) {
    response.type = err.type;
  }
  
  return NextResponse.json(response, { status: statusCode });
}

/**
 * Validation error helper
 */
export function validationError(message: string, context?: Record<string, unknown>): AppError {
  return new AppError(message, ErrorType.VALIDATION, 400, true, context);
}

/**
 * Authentication error helper
 */
export function authenticationError(message?: string, context?: Record<string, unknown>): AppError {
  return new AppError(
    message || 'Kimlik doğrulama başarısız',
    ErrorType.AUTHENTICATION,
    401,
    true,
    context
  );
}

/**
 * Authorization error helper
 */
export function authorizationError(message?: string, context?: Record<string, unknown>): AppError {
  return new AppError(
    message || 'Yetkiniz yok',
    ErrorType.AUTHORIZATION,
    403,
    true,
    context
  );
}

/**
 * Not found error helper
 */
export function notFoundError(resource: string, context?: Record<string, unknown>): AppError {
  return new AppError(
    `${resource} bulunamadı`,
    ErrorType.NOT_FOUND,
    404,
    true,
    context
  );
}

/**
 * Conflict error helper
 */
export function conflictError(message: string, context?: Record<string, unknown>): AppError {
  return new AppError(message, ErrorType.CONFLICT, 409, true, context);
}

/**
 * Database error helper
 */
export function databaseError(message?: string, context?: Record<string, unknown>): AppError {
  return new AppError(
    message || 'Veritabanı hatası',
    ErrorType.DATABASE,
    500,
    true,
    context
  );
}

/**
 * Async handler wrapper to catch errors automatically
 * 
 * Usage:
 * ```typescript
 * export const POST = asyncHandler(async (req: NextRequest) => {
 *   // Your code here - errors will be caught automatically
 * });
 * ```
 */
export function asyncHandler(
  handler: (req: Request, context?: unknown) => Promise<NextResponse>
) {
  return async (req: Request, context?: unknown): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleError(error, 'Request handler error');
    }
  };
}

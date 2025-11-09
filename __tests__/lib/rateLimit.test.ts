/**
 * Rate Limit Service Tests
 * 
 * Bu test dosyası rate limiting sisteminin doğru çalıştığını doğrular.
 * Rate limiting = API'ye gelen istek sayısını sınırlama (brute force koruması)
 * 
 * Test nedir?
 * - Fonksiyonunuzu farklı senaryolarla çalıştırırsınız
 * - Beklenen sonuçları kontrol edersiniz
 * - Eğer beklenmeyen bir şey olursa test FAIL olur
 * 
 * Test yapısı (AAA Pattern):
 * 1. ARRANGE (Hazırlık): Test verilerini ve ortamı hazırla
 * 2. ACT (Aksiyon): Test edilecek fonksiyonu çalıştır
 * 3. ASSERT (Doğrulama): Sonuçları kontrol et
 */

import { NextRequest } from 'next/server';
import {
  checkRateLimit,
  rateLimit,
  getRateLimitInfo,
  resetRateLimit,
  clearAllRateLimits,
  RateLimitConfig,
  RATE_LIMITS,
  // helper to stop the internal cleanup interval (prevents Jest open-handle warnings)
  stopRateLimitCleanup,
} from '@/lib/rateLimit';

/**
 * Mock Request Creator
 * NextRequest objesi oluşturur (test için gerekli)
 */
function createMockRequest(
  pathname: string,
  ip: string = '192.168.1.1'
): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const headers = new Headers();
  headers.set('x-forwarded-for', ip);
  
  return new NextRequest(url, {
    method: 'POST',
    headers,
  });
}

/**
 * describe = Test grubu (bir fonksiyon veya modülün tüm testleri)
 * Her describe bloğu bir konsept test eder
 */
describe('Rate Limit Service', () => {
  /**
   * beforeEach = Her test'ten ÖNCE çalışır
   * Burada test ortamını temizleriz (her test bağımsız olmalı)
   */
  beforeEach(() => {
    // Rate limit memory store'u temizle
    // Bu sayede her test temiz bir slate ile başlar
    clearAllRateLimits();
    jest.clearAllMocks();
  });

  /**
   * Test Case 1: İzin verilen istek sayısı içinde başarılı olmalı
   * 
   * Senaryo: Kullanıcı 5 istek limitli bir endpoint'e 3 istek gönderir
   * Beklenen: Hepsi başarılı olmalı (allowed: true)
   */
  test('should allow requests within limit', () => {
    // ARRANGE: Test verileri
    const config: RateLimitConfig = {
      maxRequests: 5,     // Maksimum 5 istek
      windowMs: 60000,    // 1 dakika (60 saniye = 60000 ms)
    };

    // ACT & ASSERT: 3 istek gönder, hepsi başarılı olmalı
    for (let i = 0; i < 3; i++) {
      const req = createMockRequest('/api/test', '192.168.1.1');
      const result = checkRateLimit(req, config);
      
      // expect = Doğrulama (assertion)
      // .toBe() = Tam eşitlik kontrolü (=== gibi)
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(5 - i - 1); // Kalan istek sayısı azalmalı
    }
  });

  /**
   * Test Case 2: Limit aşıldığında istekler reddedilmeli
   * 
   * Senaryo: 5 istek limitli endpoint'e 6 istek gönderilir
   * Beklenen: İlk 5'i başarılı, 6.sı reddedilmeli (allowed: false)
   */
  test('should block requests exceeding limit', () => {
    // ARRANGE
    const config: RateLimitConfig = {
      maxRequests: 5,
      windowMs: 60000,
    };

    // ACT: İlk 5 isteği gönder
    for (let i = 0; i < 5; i++) {
      const req = createMockRequest('/api/test', '192.168.1.1');
      const result = checkRateLimit(req, config);
      expect(result.allowed).toBe(true);
    }

    // ACT: 6. isteği gönder (limit aşımı)
    const req6 = createMockRequest('/api/test', '192.168.1.1');
    const blockedResult = checkRateLimit(req6, config);

    // ASSERT: 6. istek bloklanmalı
    expect(blockedResult.allowed).toBe(false);
    expect(blockedResult.remaining).toBe(0);
    expect(blockedResult.resetTime).toBeGreaterThan(Date.now());
  });

  /**
   * Test Case 3: Farklı IP'ler bağımsız olarak takip edilmeli
   * 
   * Senaryo: IP-1 5 istek gönderir (limit dolar), IP-2 istek gönderir
   * Beklenen: IP-2'nin isteği başarılı olmalı (her IP'nin kendi limiti var)
   */
  test('should track different IPs independently', () => {
    // ARRANGE
    const config: RateLimitConfig = {
      maxRequests: 5,
      windowMs: 60000,
    };

    // ACT: IP-1 ile 5 istek gönder (limit dolu)
    for (let i = 0; i < 5; i++) {
      const req = createMockRequest('/api/test', '192.168.1.1');
      checkRateLimit(req, config);
    }

    // ACT: IP-1 ile 6. istek (bloklanmalı)
    const ip1Req = createMockRequest('/api/test', '192.168.1.1');
    const ip1Blocked = checkRateLimit(ip1Req, config);
    expect(ip1Blocked.allowed).toBe(false);

    // ACT: IP-2 ile istek gönder
    const ip2Req = createMockRequest('/api/test', '192.168.1.2');
    const ip2Result = checkRateLimit(ip2Req, config);

    // ASSERT: IP-2 başarılı olmalı (farklı IP, farklı limit)
    expect(ip2Result.allowed).toBe(true);
    expect(ip2Result.remaining).toBe(4); // IP-2'nin ilk isteği
  });

  /**
   * Test Case 4: Farklı endpoint'ler bağımsız olarak takip edilmeli
   * 
   * Senaryo: Aynı IP, 2 farklı endpoint'e istek atar
   * Beklenen: Her endpoint'in ayrı limiti olmalı
   */
  test('should track different endpoints independently', () => {
    // ARRANGE
    const config: RateLimitConfig = {
      maxRequests: 3,
      windowMs: 60000,
    };

    // ACT: /api/endpoint1'e 3 istek (limit dolu)
    for (let i = 0; i < 3; i++) {
      const req = createMockRequest('/api/endpoint1', '192.168.1.1');
      checkRateLimit(req, config);
    }

    // ACT: /api/endpoint1'e 4. istek (bloklanmalı)
    const req1Blocked = createMockRequest('/api/endpoint1', '192.168.1.1');
    const result1 = checkRateLimit(req1Blocked, config);
    expect(result1.allowed).toBe(false);

    // ACT: /api/endpoint2'ye istek gönder
    const req2 = createMockRequest('/api/endpoint2', '192.168.1.1');
    const result2 = checkRateLimit(req2, config);

    // ASSERT: /api/endpoint2 başarılı olmalı (farklı endpoint)
    expect(result2.allowed).toBe(true);
    expect(result2.remaining).toBe(2);
  });

  /**
   * Test Case 5: rateLimit() fonksiyonu 429 response döndürmeli
   * 
   * Senaryo: Limit aşımında rateLimit() çağrıldığında
   * Beklenen: NextResponse (429 status code) dönmeli
   */
  test('rateLimit() should return 429 response when blocked', () => {
    // ARRANGE
    const config: RateLimitConfig = {
      maxRequests: 2,
      windowMs: 60000,
      message: 'Test rate limit message',
    };

    // ACT: Limiti doldur
    const req1 = createMockRequest('/api/test', '192.168.1.1');
    rateLimit(req1, config);
    const req2 = createMockRequest('/api/test', '192.168.1.1');
    rateLimit(req2, config);

    // ACT: 3. istek (bloklanmalı)
    const req3 = createMockRequest('/api/test', '192.168.1.1');
    const response = rateLimit(req3, config);

    // ASSERT: 429 response dönmeli
    expect(response).not.toBeNull();
    expect(response?.status).toBe(429); // Too Many Requests
    
    // Headers kontrolü
    const retryAfter = response?.headers.get('Retry-After');
    expect(retryAfter).toBeTruthy();
    expect(parseInt(retryAfter || '0')).toBeGreaterThan(0);
  });

  /**
   * Test Case 6: rateLimit() limit içinde null döndürmeli
   * 
   * Senaryo: İstek limiti dolmamışken rateLimit() çağrılır
   * Beklenen: null dönmeli (devam etmesine izin ver)
   */
  test('rateLimit() should return null when within limit', () => {
    // ARRANGE
    const config: RateLimitConfig = {
      maxRequests: 5,
      windowMs: 60000,
    };

    // ACT
    const req = createMockRequest('/api/test', '192.168.1.1');
    const response = rateLimit(req, config);

    // ASSERT: null dönmeli (istek devam edebilir)
    expect(response).toBeNull();
  });

  /**
   * Test Case 7: AUTH_STRICT preset doğru yapılandırılmış olmalı
   * 
   * Senaryo: AUTH_STRICT preset'ini kontrol et
   * Beklenen: 5 istek / 15 dakika olmalı (brute force koruması)
   */
  test('AUTH_STRICT preset should have correct configuration', () => {
    // ARRANGE
    const authStrict = RATE_LIMITS.AUTH_STRICT;

    // ASSERT: Preset değerleri doğru mu?
    expect(authStrict.maxRequests).toBe(5);                  // 5 istek
    expect(authStrict.windowMs).toBe(15 * 60 * 1000);       // 15 dakika (ms cinsinden)
    expect(authStrict.message).toContain('15 dakika');      // Mesaj kontrolü
  });

  /**
   * Test Case 8: EMAIL_SEND preset doğru yapılandırılmış olmalı
   * 
   * Senaryo: EMAIL_SEND preset'ini kontrol et
   * Beklenen: 3 istek / 1 saat olmalı (email spam koruması)
   */
  test('EMAIL_SEND preset should have correct configuration', () => {
    // ARRANGE
    const emailSend = RATE_LIMITS.EMAIL_SEND;

    // ASSERT
    expect(emailSend.maxRequests).toBe(3);                   // 3 email
    expect(emailSend.windowMs).toBe(60 * 60 * 1000);        // 1 saat
    expect(emailSend.message).toContain('email');           // Mesaj kontrolü
  });

  /**
   * Test Case 9: CV_OPERATIONS preset doğru yapılandırılmış olmalı
   * 
   * Senaryo: CV_OPERATIONS preset'ini kontrol et
   * Beklenen: 10 istek / 1 dakika olmalı (CV API koruması)
   */
  test('CV_OPERATIONS preset should have correct configuration', () => {
    // ARRANGE
    const cvOps = RATE_LIMITS.CV_OPERATIONS;

    // ASSERT
    expect(cvOps.maxRequests).toBe(10);                     // 10 istek
    expect(cvOps.windowMs).toBe(60 * 1000);                 // 1 dakika
  });

  /**
   * Test Case 10: getRateLimitInfo() bilgi döndürmeli
   * 
   * Senaryo: getRateLimitInfo() counter'ı artırmadan bilgi dönmeli
   * Beklenen: Mevcut limit durumu (artırma olmadan)
   */
  test('getRateLimitInfo() should return info without incrementing', () => {
    // ARRANGE
    const config: RateLimitConfig = {
      maxRequests: 5,
      windowMs: 60000,
    };

    // ACT: 2 istek gönder
    const req1 = createMockRequest('/api/test', '192.168.1.1');
    checkRateLimit(req1, config);
    const req2 = createMockRequest('/api/test', '192.168.1.1');
    checkRateLimit(req2, config);

    // ACT: getRateLimitInfo() çağır (counter artmamalı)
    const req3 = createMockRequest('/api/test', '192.168.1.1');
    const info = getRateLimitInfo(req3, config);

    // ASSERT: 3 kalan istek olmalı (getRateLimitInfo counter artırmadı)
    expect(info.remaining).toBe(3);
    expect(info.limit).toBe(5);

    // ASSERT: Bir sonraki checkRateLimit() hala 3 remaining görmeli
    const req4 = createMockRequest('/api/test', '192.168.1.1');
    const result = checkRateLimit(req4, config);
    expect(result.remaining).toBe(2); // 3. istek yapıldı, 2 kaldı
  });

  /**
   * Test Case 11: resetRateLimit() limit'i sıfırlamalı
   * 
   * Senaryo: Limit dolduktan sonra resetRateLimit() çağrılır
   * Beklenen: Limit sıfırlanmalı, yeni istekler kabul edilmeli
   */
  test('resetRateLimit() should reset limit for specific identifier', () => {
    // ARRANGE
    const config: RateLimitConfig = {
      maxRequests: 2,
      windowMs: 60000,
    };

    // ACT: Limiti doldur
    for (let i = 0; i < 2; i++) {
      const req = createMockRequest('/api/test', '192.168.1.1');
      checkRateLimit(req, config);
    }

    // ACT: 3. istek (bloklanmalı)
    const req3 = createMockRequest('/api/test', '192.168.1.1');
    const blocked = checkRateLimit(req3, config);
    expect(blocked.allowed).toBe(false);

    // ACT: Limit'i resetle
    resetRateLimit('192.168.1.1', '/api/test');

    // ASSERT: Yeni istek başarılı olmalı
    const req4 = createMockRequest('/api/test', '192.168.1.1');
    const result = checkRateLimit(req4, config);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1); // Yeni dönem başladı
  });

  /**
   * Test Case 12: clearAllRateLimits() tüm limitleri temizlemeli
   * 
   * Senaryo: Birden fazla IP ve endpoint'te limitler var
   * Beklenen: clearAllRateLimits() hepsini temizlemeli
   */
  test('clearAllRateLimits() should clear all rate limits', () => {
    // ARRANGE
    const config: RateLimitConfig = {
      maxRequests: 1,
      windowMs: 60000,
    };

    // ACT: Farklı IP ve endpoint'lerden istekler gönder
    const req1 = createMockRequest('/api/endpoint1', '192.168.1.1');
    checkRateLimit(req1, config);
    const req2 = createMockRequest('/api/endpoint2', '192.168.1.2');
    checkRateLimit(req2, config);

    // ACT: Her ikisi de limitlenmiş olmalı
    const blocked1 = checkRateLimit(createMockRequest('/api/endpoint1', '192.168.1.1'), config);
    const blocked2 = checkRateLimit(createMockRequest('/api/endpoint2', '192.168.1.2'), config);
    expect(blocked1.allowed).toBe(false);
    expect(blocked2.allowed).toBe(false);

    // ACT: Tüm limitleri temizle
    clearAllRateLimits();

    // ASSERT: Yeni istekler başarılı olmalı
    const newReq1 = createMockRequest('/api/endpoint1', '192.168.1.1');
    const newReq2 = createMockRequest('/api/endpoint2', '192.168.1.2');
    expect(checkRateLimit(newReq1, config).allowed).toBe(true);
    expect(checkRateLimit(newReq2, config).allowed).toBe(true);
  });
});

// Ensure we stop any background interval created by the module so Jest can exit cleanly.
// This is a best-effort cleanup for the test environment.
afterAll(() => {
  // stop the module's internal cleanup interval so Jest can exit without open handles
  stopRateLimitCleanup();
});

/**
 * Test Sonuç Örneği:
 * 
 * ✓ should allow requests within limit (5ms)
 * ✓ should block requests exceeding limit (3ms)
 * ✓ should track different IPs independently (3ms)
 * ✓ should track different endpoints independently (4ms)
 * ✓ rateLimit() should return 429 response when blocked (2ms)
 * ✓ rateLimit() should return null when within limit (1ms)
 * ✓ AUTH_STRICT preset should have correct configuration (1ms)
 * ✓ EMAIL_SEND preset should have correct configuration (1ms)
 * ✓ CV_OPERATIONS preset should have correct configuration (1ms)
 * ✓ getRateLimitInfo() should return info without incrementing (3ms)
 * ✓ resetRateLimit() should reset limit for specific identifier (4ms)
 * ✓ clearAllRateLimits() should clear all rate limits (3ms)
 * 
 * Test Suites: 1 passed, 1 total
 * Tests: 12 passed, 12 total
 * Time: 1.234s
 * 
 * Coverage:
 * File          | % Stmts | % Branch | % Funcs | % Lines
 * rateLimit.ts  |   95.2  |   88.9   |  100.0  |   95.2
 */

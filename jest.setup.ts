/**
 * Jest Setup File
 * 
 * Bu dosya her test dosyasından ÖNCE çalışır
 * Global test ayarları burada yapılır
 */

// React Testing Library matchers'ları ekle
// Bu sayede expect(element).toBeInTheDocument() gibi metodlar kullanabiliriz
import '@testing-library/jest-dom';

// TextEncoder/TextDecoder (Node.js'te hazır var)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// ReadableStream polyfill
import { ReadableStream } from 'stream/web';
global.ReadableStream = ReadableStream as typeof global.ReadableStream;

// Global mocks (taklit nesneler)
// Next.js router'ı mock'la (test ortamında gerçek router yok)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),      // Router.push() taklit fonksiyonu
      replace: jest.fn(),   // Router.replace() taklit fonksiyonu
      prefetch: jest.fn(),  // Router.prefetch() taklit fonksiyonu
      back: jest.fn(),      // Router.back() taklit fonksiyonu
    };
  },
  usePathname() {
    return '/'; // Şu anki path = '/'
  },
  useSearchParams() {
    return new URLSearchParams(); // Boş query params
  },
}));

// Environment variables (test ortamı için)
process.env.MONGODB_URI = 'mongodb://localhost:27017/cvmaker_test';
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing-only';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Console warnings'leri test sonuçlarında gösterme (daha temiz output)
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args: unknown[]) => {
    // Next.js uyarılarını gizle (test sonuçlarını kirletmesin)
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn; // Restore et
});

// Global test timeout
jest.setTimeout(10000); // 10 saniye

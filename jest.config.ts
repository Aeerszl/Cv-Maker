/**
 * Jest Configuration
 * 
 * Jest = Test framework (test koşturan sistem)
 * Bu dosya Jest'e nasıl çalışacağını söyler
 * 
 * @see https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

// Custom Jest configuration
const config: Config = {
  // Test ortamı: node = Server-side (API routes için)
  // jsdom = Client-side (React components için)
  testEnvironment: 'node',
  
  // Test dosyalarını nerede arayacak?
  // ** = Tüm alt klasörler
  // *.test.ts veya *.test.tsx uzantılı dosyalar
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Test dosyası olarak sayılmayacak klasörler
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
  ],
  
  // Her test'ten önce otomatik import edilecek dosyalar
  // Örnek: React Testing Library matchers (@testing-library/jest-dom)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Module path aliases (TypeScript path'leri ile uyumlu)
  // @/ = src/ klasörü
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Code coverage ayarları (kod coverage = test edilen kod yüzdesi)
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  
  // Coverage threshold (minimum coverage yüzdesi)
  // Eğer bu oranın altındaysa test FAIL olur
  coverageThreshold: {
    global: {
      branches: 50,    // If-else dallarının %50'si test edilmeli (başlangıç için düşük)
      functions: 50,   // Fonksiyonların %50'si test edilmeli
      lines: 50,       // Kod satırlarının %50'si test edilmeli
      statements: 50,  // Statement'ların %50'si test edilmeli
    },
  },
  
  // Transform: TypeScript/JSX dosyalarını JavaScript'e çevir
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test timeout (maksimum bekleme süresi)
  testTimeout: 10000, // 10 saniye
  
  // Verbose: Detaylı test sonuçları göster
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
};

export default config;

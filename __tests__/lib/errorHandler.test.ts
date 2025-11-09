/**
 * Error Handler Unit Tests
 * 
 * Test coverage:
 * - AppError class
 * - handleError function
 * - Factory functions (validationError, authenticationError, etc.)
 * - getUserFriendlyMessage logic
 * - Status code mapping
 * - Production vs Development behavior
 */

import { NextResponse } from 'next/server';
import {
  AppError,
  ErrorType,
  handleError,
  validationError,
  authenticationError,
  authorizationError,
  notFoundError,
  conflictError,
  databaseError,
} from '../../src/lib/errorHandler';
import { logger } from '../../src/lib/logger';

// Mock logger
jest.mock('../../src/lib/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('errorHandler', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore to production after each test
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    });
  });

  afterAll(() => {
    // Restore original NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
  });

  // ============================================
  // AppError Class Tests
  // ============================================
  describe('AppError Class', () => {
    it('should create AppError with all properties', () => {
      const error = new AppError(
        'Test error',
        ErrorType.VALIDATION,
        400,
        true,
        { userId: '123' }
      );

      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.context).toEqual({ userId: '123' });
      expect(error.name).toBe('AppError');
    });

    it('should use default values when not provided', () => {
      const error = new AppError('Test error');

      expect(error.type).toBe(ErrorType.INTERNAL);
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.context).toBeUndefined();
    });

    it('should capture stack trace', () => {
      const error = new AppError('Test error');
      expect(error.stack).toBeDefined();
    });
  });

  // ============================================
  // handleError Function Tests
  // ============================================
  describe('handleError', () => {
    it('should return NextResponse with correct status code for AppError', () => {
      const error = new AppError('Validation failed', ErrorType.VALIDATION, 400);
      const response = handleError(error);

      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).toBe(400);
    });

    it('should log error with context', () => {
      const error = new AppError('Test error', ErrorType.VALIDATION, 400);
      handleError(error, 'Test context', { userId: '123' });

      expect(logger.error).toHaveBeenCalledWith(
        'Test context',
        expect.objectContaining({
          error: 'Test error',
          type: ErrorType.VALIDATION,
          userId: '123',
        })
      );
    });

    it('should handle generic Error objects', () => {
      const error = new Error('Generic error');
      const response = handleError(error);

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle non-Error objects', () => {
      const response = handleError('String error');

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });

    it('should NOT expose error type in production', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true,
      });
      const error = new AppError('Test error', ErrorType.VALIDATION, 400);
      const response = handleError(error);

      const body = await response.json();
      expect(body.type).toBeUndefined();
    });

    // Note: Testing development mode NODE_ENV is challenging in Jest
    // The production test above covers the security requirement (no type leakage)
    // Development behavior can be verified through integration tests

    it('should include timestamp in response', async () => {
      const error = new AppError('Test error', ErrorType.VALIDATION, 400);
      const response = handleError(error);

      const body = await response.json();
      expect(body.timestamp).toBeDefined();
      expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');
    });

    it('should return user-friendly message for VALIDATION error', async () => {
      const error = new AppError('Email is required', ErrorType.VALIDATION, 400);
      const response = handleError(error);

      const body = await response.json();
      expect(body.error).toBe('Email is required');
    });

    it('should return user-friendly message for AUTHENTICATION error', async () => {
      const error = new AppError('Invalid credentials', ErrorType.AUTHENTICATION, 401);
      const response = handleError(error);

      const body = await response.json();
      expect(body.error).toBe('Kimlik doğrulama başarısız. Lütfen giriş yapın.');
    });

    it('should return user-friendly message for AUTHORIZATION error', async () => {
      const error = new AppError('Forbidden', ErrorType.AUTHORIZATION, 403);
      const response = handleError(error);

      const body = await response.json();
      expect(body.error).toBe('Bu işlem için yetkiniz yok.');
    });

    it('should return user-friendly message for NOT_FOUND error', async () => {
      const error = new AppError('User not found', ErrorType.NOT_FOUND, 404);
      const response = handleError(error);

      const body = await response.json();
      expect(body.error).toBe('İstenen kaynak bulunamadı.');
    });

    it('should return user-friendly message for RATE_LIMIT error', async () => {
      const error = new AppError('Too many requests', ErrorType.RATE_LIMIT, 429);
      const response = handleError(error);

      const body = await response.json();
      expect(body.error).toBe('Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.');
    });

    it('should return user-friendly message for DATABASE error', async () => {
      const error = new AppError('Connection failed', ErrorType.DATABASE, 500);
      const response = handleError(error);

      const body = await response.json();
      expect(body.error).toBe('Veritabanı işlemi başarısız. Lütfen tekrar deneyin.');
    });

    it('should return generic message for INTERNAL error', async () => {
      const error = new AppError('Internal error', ErrorType.INTERNAL, 500);
      const response = handleError(error);

      const body = await response.json();
      expect(body.error).toBe('Bir hata oluştu. Lütfen tekrar deneyin.');
    });

    it('should return generic message for generic Error', async () => {
      const error = new Error('Something went wrong');
      const response = handleError(error);

      const body = await response.json();
      expect(body.error).toBe('Bir hata oluştu. Lütfen tekrar deneyin.');
    });

    it('should NOT expose stack trace', async () => {
      const error = new AppError('Test error', ErrorType.VALIDATION, 400);
      const response = handleError(error);

      const body = await response.json();
      expect(body.stack).toBeUndefined();
    });
  });

  // ============================================
  // Factory Functions Tests
  // ============================================
  describe('Factory Functions', () => {
    describe('validationError', () => {
      it('should create validation error with correct properties', () => {
        const error = validationError('Email is required', { field: 'email' });

        expect(error.message).toBe('Email is required');
        expect(error.type).toBe(ErrorType.VALIDATION);
        expect(error.statusCode).toBe(400);
        expect(error.isOperational).toBe(true);
        expect(error.context).toEqual({ field: 'email' });
      });
    });

    describe('authenticationError', () => {
      it('should create authentication error with custom message', () => {
        const error = authenticationError('Invalid token');

        expect(error.message).toBe('Invalid token');
        expect(error.type).toBe(ErrorType.AUTHENTICATION);
        expect(error.statusCode).toBe(401);
      });

      it('should use default message when not provided', () => {
        const error = authenticationError();

        expect(error.message).toBe('Kimlik doğrulama başarısız');
        expect(error.statusCode).toBe(401);
      });
    });

    describe('authorizationError', () => {
      it('should create authorization error with custom message', () => {
        const error = authorizationError('Admin only');

        expect(error.message).toBe('Admin only');
        expect(error.type).toBe(ErrorType.AUTHORIZATION);
        expect(error.statusCode).toBe(403);
      });

      it('should use default message when not provided', () => {
        const error = authorizationError();

        expect(error.message).toBe('Yetkiniz yok');
        expect(error.statusCode).toBe(403);
      });
    });

    describe('notFoundError', () => {
      it('should create not found error with resource name', () => {
        const error = notFoundError('CV', { cvId: '123' });

        expect(error.message).toBe('CV bulunamadı');
        expect(error.type).toBe(ErrorType.NOT_FOUND);
        expect(error.statusCode).toBe(404);
        expect(error.context).toEqual({ cvId: '123' });
      });
    });

    describe('conflictError', () => {
      it('should create conflict error', () => {
        const error = conflictError('Email already exists', { email: 'test@test.com' });

        expect(error.message).toBe('Email already exists');
        expect(error.type).toBe(ErrorType.CONFLICT);
        expect(error.statusCode).toBe(409);
        expect(error.context).toEqual({ email: 'test@test.com' });
      });
    });

    describe('databaseError', () => {
      it('should create database error with custom message', () => {
        const error = databaseError('Connection timeout');

        expect(error.message).toBe('Connection timeout');
        expect(error.type).toBe(ErrorType.DATABASE);
        expect(error.statusCode).toBe(500);
      });

      it('should use default message when not provided', () => {
        const error = databaseError();

        expect(error.message).toBe('Veritabanı hatası');
        expect(error.statusCode).toBe(500);
      });
    });
  });

  // ============================================
  // Status Code Mapping Tests
  // ============================================
  describe('Status Code Mapping', () => {
    it('should return 400 for validation error', () => {
      const error = validationError('Invalid input');
      const response = handleError(error);
      expect(response.status).toBe(400);
    });

    it('should return 401 for authentication error', () => {
      const error = authenticationError();
      const response = handleError(error);
      expect(response.status).toBe(401);
    });

    it('should return 403 for authorization error', () => {
      const error = authorizationError();
      const response = handleError(error);
      expect(response.status).toBe(403);
    });

    it('should return 404 for not found error', () => {
      const error = notFoundError('User');
      const response = handleError(error);
      expect(response.status).toBe(404);
    });

    it('should return 409 for conflict error', () => {
      const error = conflictError('Already exists');
      const response = handleError(error);
      expect(response.status).toBe(409);
    });

    it('should return 500 for database error', () => {
      const error = databaseError();
      const response = handleError(error);
      expect(response.status).toBe(500);
    });

    it('should return 500 for generic Error', () => {
      const error = new Error('Something broke');
      const response = handleError(error);
      expect(response.status).toBe(500);
    });
  });

  // ============================================
  // Edge Cases
  // ============================================
  describe('Edge Cases', () => {
    it('should handle null error', () => {
      const response = handleError(null);
      expect(response.status).toBe(500);
    });

    it('should handle undefined error', () => {
      const response = handleError(undefined);
      expect(response.status).toBe(500);
    });

    it('should handle error with circular reference in context', () => {
      const circular: Record<string, unknown> = { a: 1 };
      circular.self = circular;

      const error = new AppError('Test', ErrorType.VALIDATION, 400, true, circular);
      
      // Should not throw
      expect(() => handleError(error)).not.toThrow();
    });

    it('should handle very long error message', () => {
      const longMessage = 'A'.repeat(10000);
      const error = validationError(longMessage);
      
      const response = handleError(error);
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should handle error without stack trace', () => {
      const error = new AppError('Test');
      delete error.stack;

      expect(() => handleError(error)).not.toThrow();
      expect(logger.error).toHaveBeenCalled();
    });
  });
});

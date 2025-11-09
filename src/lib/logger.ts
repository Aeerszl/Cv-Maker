/**
 * Logger Service
 * 
 * Production-safe logging utility with different log levels.
 * Automatically disabled in production unless explicitly enabled.
 * 
 * Features:
 * - Different log levels (debug, info, warn, error)
 * - Timestamp support
 * - Context support for better debugging
 * - Production-safe (no logs in production by default)
 * - Structured logging
 * 
 * @module lib/logger
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment: boolean;
  private enableProductionLogs: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.enableProductionLogs = process.env.ENABLE_PRODUCTION_LOGS === 'true';
  }

  /**
   * Check if logging is enabled
   */
  private shouldLog(level: LogLevel): boolean {
    // Always log errors
    if (level === 'error') return true;
    
    // In development, log everything
    if (this.isDevelopment) return true;
    
    // In production, only log if explicitly enabled
    return this.enableProductionLogs;
  }

  /**
   * Format log message with timestamp and level
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Debug level logging - Development only
   */
  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  /**
   * Info level logging - General information
   */
  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  /**
   * Warning level logging - Potential issues
   */
  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  /**
   * Error level logging - Always logged
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      } : error,
    };
    
    console.error(this.formatMessage('error', message, errorContext));
  }

  /**
   * Log API request/response for debugging
   */
  api(method: string, endpoint: string, status: number, duration?: number): void {
    if (this.shouldLog('info')) {
      const context = {
        method,
        endpoint,
        status,
        duration: duration ? `${duration}ms` : undefined,
      };
      this.info('API Request', context);
    }
  }

  /**
   * Log database operations
   */
  db(operation: string, collection: string, duration?: number): void {
    if (this.shouldLog('debug')) {
      const context = {
        operation,
        collection,
        duration: duration ? `${duration}ms` : undefined,
      };
      this.debug('DB Operation', context);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for testing/mocking
export type { Logger, LogLevel, LogContext };

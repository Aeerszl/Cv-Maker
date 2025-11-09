/**
 * Input Sanitization Utilities
 * 
 * Prevents XSS, NoSQL Injection, and other malicious input attacks.
 * 
 * @module lib/sanitize
 */

import validator from 'validator';
import { validationError } from './errorHandler';

/**
 * Simple HTML tag stripper (server-safe alternative to DOMPurify)
 */
function stripHTML(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitization options
 */
export interface SanitizeOptions {
  allowHTML?: boolean;        // Allow safe HTML tags
  maxLength?: number;          // Maximum length
  minLength?: number;          // Minimum length
  trim?: boolean;              // Trim whitespace
  lowercase?: boolean;         // Convert to lowercase
  uppercase?: boolean;         // Convert to uppercase
  alphanumeric?: boolean;      // Only allow alphanumeric chars
  pattern?: RegExp;            // Custom regex pattern
}

/**
 * Sanitize string input
 * 
 * @example
 * const name = sanitizeString(userInput, { maxLength: 100, trim: true });
 */
export function sanitizeString(
  input: unknown,
  options: SanitizeOptions = {}
): string {
  // Type check
  if (typeof input !== 'string') {
    throw validationError('Input must be a string');
  }

  let result = input;

  // Trim whitespace
  if (options.trim !== false) {
    result = result.trim();
  }

  // Remove HTML tags (default behavior for security)
  if (!options.allowHTML) {
    result = stripHTML(result);
  } else {
    // Even with allowHTML, strip dangerous content
    result = stripHTML(result);
  }

  // Case conversion
  if (options.lowercase) {
    result = result.toLowerCase();
  }
  if (options.uppercase) {
    result = result.toUpperCase();
  }

  // Alphanumeric only
  if (options.alphanumeric) {
    result = result.replace(/[^a-zA-Z0-9\s]/g, '');
  }

  // Custom pattern
  if (options.pattern && !options.pattern.test(result)) {
    throw validationError('Input does not match required format');
  }

  // Length validation
  if (options.minLength && result.length < options.minLength) {
    throw validationError(`Input must be at least ${options.minLength} characters`);
  }
  if (options.maxLength && result.length > options.maxLength) {
    throw validationError(`Input must not exceed ${options.maxLength} characters`);
  }

  return result;
}

/**
 * Sanitize email address
 * 
 * @example
 * const email = sanitizeEmail('user@EXAMPLE.com'); // -> 'user@example.com'
 */
export function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') {
    throw validationError('Email must be a string');
  }

  const email = input.trim().toLowerCase();

  // Validate email format
  if (!validator.isEmail(email)) {
    throw validationError('Geçersiz email adresi');
  }

  // Normalize email (remove dots from Gmail, etc.)
  const normalized = validator.normalizeEmail(email) || email;

  return normalized;
}

/**
 * Sanitize phone number
 * 
 * @example
 * const phone = sanitizePhone('+90 (555) 123-4567'); // -> '+905551234567'
 */
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') {
    throw validationError('Phone must be a string');
  }

  // Remove all non-digit characters except leading +
  const cleaned = input.replace(/[^\d+]/g, '');

  // Basic validation (adjust based on your requirements)
  if (cleaned.length < 10 || cleaned.length > 15) {
    throw validationError('Geçersiz telefon numarası');
  }

  return cleaned;
}

/**
 * Sanitize URL
 * 
 * @example
 * const url = sanitizeURL('https://example.com/path');
 */
export function sanitizeURL(input: unknown, options?: { requireHTTPS?: boolean }): string {
  if (typeof input !== 'string') {
    throw validationError('URL must be a string');
  }

  const url = input.trim();

  // Validate URL format
  if (!validator.isURL(url, { require_protocol: true })) {
    throw validationError('Geçersiz URL formatı');
  }

  // Require HTTPS
  if (options?.requireHTTPS && !url.startsWith('https://')) {
    throw validationError('URL must use HTTPS protocol');
  }

  // Prevent javascript: and data: URLs (XSS prevention)
  if (url.startsWith('javascript:') || url.startsWith('data:')) {
    throw validationError('Invalid URL protocol');
  }

  return url;
}

/**
 * Sanitize object - recursively sanitize all string values
 * 
 * @example
 * const sanitized = sanitizeObject({
 *   name: '<script>alert("xss")</script>John',
 *   bio: 'Safe text'
 * }, { maxLength: 1000 });
 * // -> { name: 'John', bio: 'Safe text' }
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: SanitizeOptions = {}
): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      try {
        result[key] = sanitizeString(value, options);
      } catch {
        // Skip invalid values
        result[key] = '';
      }
    } else if (Array.isArray(value)) {
      result[key] = value.map(item =>
        typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>, options)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value as Record<string, unknown>, options);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

/**
 * Prevent NoSQL injection by checking for MongoDB operators
 * 
 * @example
 * const query = preventNoSQLInjection({ email: userInput });
 */
export function preventNoSQLInjection<T>(input: T): T {
  if (typeof input === 'object' && input !== null) {
    const obj = input as Record<string, unknown>;
    
    for (const key of Object.keys(obj)) {
      // Check for MongoDB operators
      if (key.startsWith('$')) {
        throw validationError('Invalid query parameters');
      }
      
      // Recursively check nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = preventNoSQLInjection(obj[key]);
      }
    }
  }
  
  return input;
}

/**
 * Validate and sanitize CV personal info
 */
export function sanitizeCVPersonalInfo(data: unknown): Record<string, unknown> {
  if (typeof data !== 'object' || data === null) {
    throw validationError('Personal info must be an object');
  }

  const info = data as Record<string, unknown>;

  return {
    firstName: sanitizeString(info.firstName, { maxLength: 50, minLength: 2 }),
    lastName: sanitizeString(info.lastName, { maxLength: 50, minLength: 2 }),
    email: sanitizeEmail(info.email),
    phone: info.phone ? sanitizePhone(info.phone) : '',
    title: sanitizeString(info.title, { maxLength: 100 }),
    city: sanitizeString(info.city, { maxLength: 50 }),
    country: info.country ? sanitizeString(info.country, { maxLength: 50 }) : '',
    address: info.address ? sanitizeString(info.address, { maxLength: 200 }) : '',
    postalCode: info.postalCode ? sanitizeString(info.postalCode, { maxLength: 20 }) : '',
    linkedIn: info.linkedIn ? sanitizeURL(info.linkedIn) : '',
    website: info.website ? sanitizeURL(info.website) : '',
  };
}

/**
 * Sanitize text content (summary, descriptions, etc.)
 */
export function sanitizeTextContent(input: unknown, maxLength: number = 5000): string {
  return sanitizeString(input, {
    maxLength,
    minLength: 10,
    allowHTML: false, // No HTML in text content
    trim: true,
  });
}

/**
 * Sanitize rich text content (if you need to allow some HTML)
 */
export function sanitizeRichText(input: unknown, maxLength: number = 10000): string {
  return sanitizeString(input, {
    maxLength,
    allowHTML: true, // Allow safe HTML tags
    trim: true,
  });
}

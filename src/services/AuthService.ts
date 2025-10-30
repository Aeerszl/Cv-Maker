/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls.
 * Implements Service Layer pattern for separation of concerns.
 * 
 * @module services/AuthService
 */

/**
 * User Registration Data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * User Login Data
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * API Response Interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Authentication Service Class
 * 
 * Singleton pattern for managing authentication API calls.
 * Provides clean, typed methods for auth operations.
 * 
 * @example
 * ```ts
 * const authService = AuthService.getInstance();
 * const result = await authService.register(userData);
 * ```
 */
export class AuthService {
  private static instance: AuthService;
  private readonly baseUrl: string = '/api/auth';

  /**
   * Private constructor for Singleton pattern
   */
  private constructor() {}

  /**
   * Get singleton instance
   * 
   * @returns AuthService instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Register a new user
   * 
   * @param data - User registration data
   * @returns API response with user data
   */
  public async register(data: RegisterData): Promise<ApiResponse> {
    try {
      // Transform data to match API expectations
      const apiData = {
        fullName: data.name, // API expects fullName, not name
        email: data.email,
        password: data.password,
      };

      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Kayıt başarısız oldu',
        };
      }

      return {
        success: true,
        data: result.user,
        message: result.message || 'Kayıt başarılı!',
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        error: 'Bağlantı hatası. Lütfen tekrar deneyin.',
      };
    }
  }

  /**
   * Validate email format
   * 
   * @param email - Email to validate
   * @returns True if valid
   */
  public validateEmail(email: string): boolean {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * 
   * @param password - Password to validate
   * @returns Validation result with message
   */
  public validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return {
        valid: false,
        message: 'Şifre en az 6 karakter olmalıdır',
      };
    }

    if (password.length > 100) {
      return {
        valid: false,
        message: 'Şifre çok uzun',
      };
    }

    return { valid: true };
  }
}

/**
 * Export singleton instance
 * Convenient default export for direct usage
 */
export const authService = AuthService.getInstance();

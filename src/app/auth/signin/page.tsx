/**
 * Sign In Page
 * 
 * User login page with elegant design and NextAuth integration.
 * 
 * @module app/auth/signin/page
 */

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { authService } from '@/services/AuthService';

/**
 * Sign In Form Data
 */
interface SignInFormData {
  email: string;
  password: string;
}

/**
 * Sign In Page Component
 */
export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  /**
   * Handle form submission
   */
  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // Sign in with NextAuth
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Email doğrulama hatası kontrolü
        if (result.error.includes('email')) {
          setError(result.error);
        } else {
          setError('E-posta veya şifre hatalı');
        }
        return;
      }

      // Redirect to dashboard on success
      router.push('/dashboard');
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hoş Geldiniz
          </h1>
          <p className="text-gray-600">
            Hesabınıza giriş yapın
          </p>
        </div>

        {/* Form Card */}
        <Card variant="elevated" padding="lg" className="animate-slide-up">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <Input
              label="E-posta"
              type="email"
              placeholder="ornek@email.com"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              fullWidth
              autoFocus
              {...register('email', {
                required: 'E-posta gereklidir',
                validate: (value) =>
                  authService.validateEmail(value) || 'Geçerli bir e-posta giriniz',
              })}
            />

            {/* Password Input */}
            <Input
              label="Şifre"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              fullWidth
              {...register('password', {
                required: 'Şifre gereklidir',
                minLength: {
                  value: 6,
                  message: 'Şifre en az 6 karakter olmalıdır',
                },
              })}
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Şifrenizi mi unuttunuz?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-600">{error}</p>
                    {error.includes('email') && (
                      <Link
                        href="/auth/verify-email"
                        className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                      >
                        Email doğrulama sayfasına git →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight size={18} />}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Kayıt Olun
              </Link>
            </p>
          </div>
        </Card>

        {/* Features */}
        <div className="text-center text-sm text-gray-500 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p>Ücretsiz • ATS Uyumlu • PDF Export</p>
        </div>
      </div>
    </div>
  );
}

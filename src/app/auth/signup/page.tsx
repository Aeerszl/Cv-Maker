/**
 * Sign Up Page
 * 
 * User registration page with elegant design.
 * Implements form validation, loading states, and smooth animations.
 * 
 * @module app/auth/signup/page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { authService, RegisterData } from '@/services/AuthService';

/**
 * Form Data Interface
 */
interface SignUpFormData extends RegisterData {
  confirmPassword: string;
}

/**
 * Sign Up Page Component
 * 
 * Features:
 * - Form validation with react-hook-form
 * - Password strength validation
 * - Loading states
 * - Success/Error messages
 * - Smooth animations
 */
export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>();

  /**
   * Handle form submission
   */
  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      setError('');

      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        setError('Şifreler eşleşmiyor');
        return;
      }

      // Call auth service
      const result = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        setError(result.error || 'Kayıt başarısız oldu');
        return;
      }

      // Redirect to verification page
      const email = data.email;
      const devCode = result.devCode; // Development mode code
      const url = `/auth/verify-email?email=${encodeURIComponent(email)}${devCode ? `&code=${devCode}` : ''}`;
      router.push(url);
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Sign up error:', err);
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
            Hesap Oluştur
          </h1>
          <p className="text-gray-600">
            Profesyonel CV&apos;nizi oluşturmaya başlayın
          </p>
        </div>

        {/* Form Card */}
        <Card variant="elevated" padding="lg" className="animate-slide-up">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Input */}
            <Input
              label="Ad Soyad"
              type="text"
              placeholder="Ahmet Yılmaz"
              leftIcon={<User size={18} />}
              error={errors.name?.message}
              fullWidth
              {...register('name', {
                required: 'Ad soyad gereklidir',
                minLength: {
                  value: 3,
                  message: 'En az 3 karakter olmalıdır',
                },
              })}
            />

            {/* Email Input */}
            <Input
              label="E-posta"
              type="email"
              placeholder="ornek@email.com"
              leftIcon={<Mail size={18} />}
              error={errors.email?.message}
              fullWidth
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
              helperText="En az 6 karakter"
              fullWidth
              {...register('password', {
                required: 'Şifre gereklidir',
                validate: (value) => {
                  const result = authService.validatePassword(value);
                  return result.valid || result.message;
                },
              })}
            />

            {/* Confirm Password Input */}
            <Input
              label="Şifre Tekrar"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              fullWidth
              {...register('confirmPassword', {
                required: 'Şifre tekrarı gereklidir',
                validate: (value) =>
                  value === watch('password') || 'Şifreler eşleşmiyor',
              })}
            />

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
                <p className="text-sm text-red-600">{error}</p>
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
              {isLoading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
            </Button>
          </form>
        </Card>

        {/* Sign In Link */}
        <div className="text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
          <p className="text-gray-600">
            Zaten hesabınız var mı?{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Giriş Yapın
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {['ATS uyumlu şablonlar', 'PDF export', 'Sınırsız CV'].map((feature, index) => (
            <div key={index} className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

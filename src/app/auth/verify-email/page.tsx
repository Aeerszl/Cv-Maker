/**
 * Email Verification Page
 * 
 * User enters 6-digit verification code sent to their email
 * 
 * @module app/auth/verify-email
 */

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const urlCode = searchParams.get('code'); // Development mode code from URL
  const { language } = useLanguage();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [devCode, setDevCode] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      router.push('/auth/signup');
    }
  }, [email, router]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
    
    // Set devCode from URL if available (from registration)
    if (urlCode) {
      setDevCode(urlCode);
    }
  }, [urlCode]);

  /**
   * Handle code input
   */
  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newCode.every((digit) => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  /**
   * Handle backspace
   */
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * Handle paste
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  /**
   * Verify the code
   */
  const handleVerify = async (codeToVerify: string) => {
    if (!email) return;

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeToVerify, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Doğrulama başarısız / Verification failed');
      }

      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin?verified=true');
      }, 2000);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  /**
   * Resend verification code
   */
  const handleResend = async () => {
    if (!email || !canResend) return;

    setIsSending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setCountdown(data.waitTime || 60);
          setCanResend(false);
        }
        throw new Error(data.error || 'Kod gönderilemedi / Failed to send code');
      }

      // Development mode: Show code in UI
      if (data.devCode) {
        setDevCode(data.devCode);
      }

      setCanResend(false);
      setCountdown(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  if (!email) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-border">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {language === 'tr' ? '✅ Email Doğrulandı!' : '✅ Email Verified!'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {language === 'tr'
                ? 'Hesabınız başarıyla aktifleştirildi. Giriş sayfasına yönlendiriliyorsunuz...'
                : 'Your account has been successfully activated. Redirecting to sign in...'}
            </p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {language === 'tr' ? 'Email Doğrulama' : 'Email Verification'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {language === 'tr'
                ? `${email} adresine gönderilen 6 haneli kodu girin`
                : `Enter the 6-digit code sent to ${email}`}
            </p>
          </div>

          {/* Spam Warning Banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-600 rounded-xl shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  📧 {language === 'tr' ? 'Email\'inizi Kontrol Edin!' : 'Check Your Email!'}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  {language === 'tr' 
                    ? 'Gelen kutunuzu kontrol edin. Email bulamadıysanız '
                    : 'Check your inbox. If you don\'t see the email, '}
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {language === 'tr' ? 'SPAM klasörünü' : 'check your SPAM folder'}
                  </span>
                  {language === 'tr' ? ' kontrol etmeyi unutmayın!' : ' too!'}
                </p>
              </div>
            </div>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            {/* Development Mode Code Display */}
            {devCode && (
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-2 text-center">
                  🔧 {language === 'tr' ? 'DEVELOPMENT MODU' : 'DEVELOPMENT MODE'}
                </p>
                <p className="text-center text-2xl font-mono font-bold text-yellow-900 dark:text-yellow-200 tracking-wider">
                  {devCode}
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2 text-center">
                  {language === 'tr'
                    ? 'Bu kodu yukarıdaki kutulara girin (email gönderilmedi)'
                    : 'Enter this code in the boxes above (email not sent)'}
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
                  disabled={isVerifying}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {language === 'tr' ? 'Kod 5 dakika geçerlidir' : 'Code valid for 5 minutes'}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Verifying State */}
          {isVerifying && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {language === 'tr' ? 'Doğrulanıyor...' : 'Verifying...'}
              </p>
            </div>
          )}

          {/* Resend Button */}
          <div className="text-center mb-6">
            <button
              onClick={handleResend}
              disabled={!canResend || isSending}
              className="text-sm text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSending ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === 'tr' ? 'Gönderiliyor...' : 'Sending...'}
                </span>
              ) : canResend ? (
                language === 'tr' ? 'Yeni Kod Gönder' : 'Resend Code'
              ) : (
                `${language === 'tr' ? 'Yeni kod gönder' : 'Resend code'} (${countdown}s)`
              )}
            </button>
          </div>

          {/* Back to Sign Up */}
          <div className="text-center pt-6 border-t border-border">
            <Link
              href="/auth/signup"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === 'tr' ? '← Kayıt sayfasına dön' : '← Back to sign up'}
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'tr'
              ? 'Kodu alamadınız mı? Spam klasörünü kontrol edin.'
              : "Didn't receive the code? Check your spam folder."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

/**
 * Email Service using Resend
 * 
 * Handles all email sending functionality for the application
 * Tracks email usage for Resend API limit monitoring
 * 
 * @module lib/email
 */

import { Resend } from 'resend';
import { AnalyticsService } from '@/services/AnalyticsService';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification code email
 * 
 * @param email - Recipient email address
 * @param code - 6-digit verification code
 * @param language - User's preferred language ('tr' or 'en')
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  language: 'tr' | 'en' = 'tr'
) {
  const subject = language === 'tr' 
    ? '✉️ Email Doğrulama Kodu - CvMaker.Aliee'
    : '✉️ Email Verification Code - CvMaker.Aliee';

  const htmlContent = language === 'tr' ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin-bottom: 20px;
          }
          .code-box {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          }
          .code {
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #667eea;
            margin: 20px 0;
          }
          .message {
            color: white;
            font-size: 18px;
            margin: 20px 0;
          }
          .warning {
            background: rgba(255,255,255,0.2);
            border-radius: 8px;
            padding: 15px;
            color: white;
            font-size: 14px;
            margin-top: 20px;
          }
          .footer {
            color: rgba(255,255,255,0.8);
            font-size: 12px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">📄 CvMaker.Aliee</div>
          <p class="message">Hesabınızı doğrulamak için aşağıdaki kodu kullanın:</p>
          
          <div class="code-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Doğrulama Kodunuz</p>
            <div class="code">${code}</div>
            <p style="margin: 0; color: #666; font-size: 14px;">Bu kod 5 dakika geçerlidir</p>
          </div>

          <div class="warning">
            ⏰ Bu kod 5 dakika içinde geçersiz olacaktır.<br>
            🔒 Bu kodu kimseyle paylaşmayın.
          </div>

          <div class="footer">
            Bu emaili siz istemediyseniz, lütfen göz ardı edin.<br>
            © 2024 CvMaker.Aliee - Profesyonel CV Oluşturma Platformu
          </div>
        </div>
      </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: white;
            margin-bottom: 20px;
          }
          .code-box {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          }
          .code {
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #667eea;
            margin: 20px 0;
          }
          .message {
            color: white;
            font-size: 18px;
            margin: 20px 0;
          }
          .warning {
            background: rgba(255,255,255,0.2);
            border-radius: 8px;
            padding: 15px;
            color: white;
            font-size: 14px;
            margin-top: 20px;
          }
          .footer {
            color: rgba(255,255,255,0.8);
            font-size: 12px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">📄 CvMaker.Aliee</div>
          <p class="message">Use the code below to verify your account:</p>
          
          <div class="code-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Your Verification Code</p>
            <div class="code">${code}</div>
            <p style="margin: 0; color: #666; font-size: 14px;">This code is valid for 5 minutes</p>
          </div>

          <div class="warning">
            ⏰ This code will expire in 5 minutes.<br>
            🔒 Do not share this code with anyone.
          </div>

          <div class="footer">
            If you didn't request this email, please ignore it.<br>
            © 2024 CvMaker.Aliee - Professional CV Creation Platform
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'CvMaker.Aliee <onboarding@resend.dev>',
      to: [email],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('❌ Email sending error:', error);
      
      // Development mode: Log email instead of throwing error
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 [DEV MODE] Email would be sent to:', email);
        console.log('📧 [DEV MODE] Verification code:', code);
        console.log('💡 Resend test domain only sends to your verified email (aliee.developer@gmail.com)');
        
        // Track email attempt even in dev mode (for testing analytics)
        try {
          await AnalyticsService.trackEmailSent();
        } catch (trackError) {
          console.error('Failed to track email in dev mode:', trackError);
        }
        
        // Return false to indicate email wasn't sent
        return false;
      }
      
      throw new Error('Email gönderilemedi / Failed to send email');
    }

    console.log('✅ Email sent successfully:', data);
    
    // Track successful email send for API usage monitoring
    try {
      await AnalyticsService.trackEmailSent();
      console.log('📊 Email usage tracked successfully');
    } catch (trackError) {
      console.error('⚠️ Failed to track email usage:', trackError);
      // Don't throw - email was sent successfully, tracking is secondary
    }
    
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    throw error;
  }
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  language: 'tr' | 'en' = 'tr'
) {
  const subject = language === 'tr'
    ? '🎉 Hoş Geldiniz! - CvMaker.Aliee'
    : '🎉 Welcome! - CvMaker.Aliee';

  const htmlContent = language === 'tr' ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: white;
            margin: 20px 0;
          }
          .content {
            background: white;
            color: #333;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🎉</div>
          <h1>Hoş Geldiniz, ${name}!</h1>
          <p>Email adresiniz başarıyla doğrulandı.</p>
          
          <div class="content">
            <h2>🚀 Hemen Başlayın!</h2>
            <p>Artık tüm özelliklere erişebilirsiniz:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>✅ 5 Profesyonel CV Şablonu</li>
              <li>✅ ATS Uyumlu Tasarımlar</li>
              <li>✅ Sınırsız CV Oluşturma</li>
              <li>✅ PDF İndirme</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Dashboard'a Git</a>
          </div>

          <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 30px;">
            © 2024 CvMaker.Aliee - Profesyonel CV Oluşturma Platformu
          </p>
        </div>
      </body>
    </html>
  ` : `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            color: white;
          }
          .logo {
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: white;
            margin: 20px 0;
          }
          .content {
            background: white;
            color: #333;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🎉</div>
          <h1>Welcome, ${name}!</h1>
          <p>Your email has been successfully verified.</p>
          
          <div class="content">
            <h2>🚀 Get Started!</h2>
            <p>You now have access to all features:</p>
            <ul style="text-align: left; display: inline-block;">
              <li>✅ 5 Professional CV Templates</li>
              <li>✅ ATS Compatible Designs</li>
              <li>✅ Unlimited CV Creation</li>
              <li>✅ PDF Download</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Go to Dashboard</a>
          </div>

          <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 30px;">
            © 2024 CvMaker.Aliee - Professional CV Creation Platform
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'CvMaker.Aliee <onboarding@resend.dev>',
      to: [email],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('❌ Welcome email error:', error);
      throw new Error('Welcome email gönderilemedi');
    }

    console.log('✅ Welcome email sent:', data);
    
    // Track welcome email for API usage monitoring
    try {
      await AnalyticsService.trackEmailSent();
      console.log('📊 Welcome email usage tracked');
    } catch (trackError) {
      console.error('⚠️ Failed to track welcome email usage:', trackError);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Welcome email service error:', error);
    throw error;
  }
}

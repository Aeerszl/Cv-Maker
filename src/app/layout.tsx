import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVMaker.Aliee - Professional CV Builder | Profesyonel CV Oluşturucu",
  description: "Create your professional CV with ATS-friendly templates | ATS uyumlu şablonlar ile profesyonel CV'nizi kolayca oluşturun",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/Logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/Logo.png?v=2" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/Logo.png?v=2" sizes="512x512" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <ToastProvider>
                {children}
                <ToastContainer />
              </ToastProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

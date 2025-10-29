/**
 * Theme Provider Component
 * 
 * Provides dark/light mode support using next-themes
 * 
 * @module components/providers/ThemeProvider
 */

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

/**
 * Link Tracking Hook
 * 
 * Client-side hook for tracking external link clicks
 * 
 * @module hooks/useLinkTracking
 */

'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';

export function useLinkTracking() {
  const pathname = usePathname();

  const trackLinkClick = useCallback(
    async (linkUrl: string) => {
      try {
        await fetch('/api/analytics/track-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            linkUrl,
            page: pathname,
          }),
        });
      } catch (error) {
        console.error('Failed to track link click:', error);
        // Silently fail - don't break user experience
      }
    },
    [pathname]
  );

  return { trackLinkClick };
}

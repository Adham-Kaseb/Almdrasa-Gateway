import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = '(max-width: 768px)';

const MOBILE_UA_REGEX =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i;

/**
 * Detects whether the current device is a mobile phone.
 * Uses a dual strategy:
 * 1. CSS media query `(max-width: 768px)` for viewport-based detection (reactive).
 * 2. User-Agent string check for device-level detection.
 *
 * Returns `true` if **either** signal matches.
 */
export function useMobileDetect(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    const viewportMatch = window.matchMedia(MOBILE_BREAKPOINT).matches;
    const uaMatch = MOBILE_UA_REGEX.test(navigator.userAgent);

    return viewportMatch || uaMatch;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const uaMatch = MOBILE_UA_REGEX.test(navigator.userAgent);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches || uaMatch);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
}

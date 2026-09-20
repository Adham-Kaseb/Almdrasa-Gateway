const SESSION_COOKIE_NAME = 'almdrasa_gateway_entered';
const SESSION_STORAGE_KEY = 'almdrasa_gateway_entered';

/**
 * Checks whether the user has already entered the gateway in the current browser session.
 * - Session cookies survive tab closes/reopens within the same browser session.
 * - Closing and quitting the browser clears session cookies.
 */
export const hasEnteredInCurrentSession = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    // 1. Check sessionStorage (active tab)
    if (sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true') {
      return true;
    }

    // 2. Check session cookie (persists across tab closes in the same browser session)
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${SESSION_COOKIE_NAME}=`)) {
        const val = cookie.substring(`${SESSION_COOKIE_NAME}=`.length);
        if (val === 'true') {
          // Re-sync with sessionStorage
          sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
          return true;
        }
      }
    }
  } catch {
    // Graceful fallback
  }

  return false;
};

/**
 * Marks the current browser session as having passed through the luxury entrance.
 */
export const markSessionEntered = (): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    // Session cookie without Max-Age or Expires -> browser deletes upon browser exit
    document.cookie = `${SESSION_COOKIE_NAME}=true; path=/; SameSite=Lax`;
  } catch {
    // Graceful fallback
  }
};

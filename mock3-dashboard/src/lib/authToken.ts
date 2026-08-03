/**
 * Stores a reference to Clerk's getToken() function instead of the token string.
 * This allows the Axios interceptor to call getToken() on each request,
 * ensuring the token is always fresh (Clerk auto-refreshes before expiry).
 *
 * Clerk JWT tokens expire in ~60 seconds in development. Storing the string
 * statically causes 401 errors after expiry.
 */

type TokenFn = () => Promise<string | null>;

let getTokenFn: TokenFn | null = null;

export function setAuthToken(fn: TokenFn | null) {
  getTokenFn = fn;
}

export async function getAuthToken(): Promise<string | null> {
  if (!getTokenFn) return null;
  try {
    return await getTokenFn();
  } catch {
    return null;
  }
}

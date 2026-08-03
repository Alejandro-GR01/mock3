import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { setAuthToken } from "@/lib/authToken";
import { syncUser } from "@/lib/auth";
import { useAuthStore } from "@/stores/auth.store";
import { useCallback, useEffect, useRef } from "react";

export function useAuth() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { isSignedIn, getToken } = useClerkAuth();
  const setReady = useAuthStore((s) => s.setReady);
  const syncedRef = useRef(false);

  const initAuth = useCallback(async () => {
    // Store the getToken function itself, NOT a static token string.
    // Clerk auto-refreshes tokens — calling getToken() on each request
    // guarantees freshness and prevents 401 on expired tokens.
    setAuthToken(() => getToken());
    const token = await getToken();
    if (token) {
      await syncUser();
    }
    setReady();
  }, [getToken, setReady]);

  useEffect(() => {
    if (isSignedIn && !syncedRef.current) {
      syncedRef.current = true;
      initAuth();
    }
  }, [isSignedIn, initAuth]);

  return { user, isSignedIn, isLoaded: isUserLoaded, getToken };
}

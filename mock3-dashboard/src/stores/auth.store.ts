import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AuthState {
  isReady: boolean;
  setReady: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isReady: false,
      setReady: () => set({ isReady: true }),
      reset: () => set({ isReady: false }),
    }),
    { name: "mock3-auth" }
  )
);

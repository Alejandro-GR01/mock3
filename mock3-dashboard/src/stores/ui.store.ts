import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  paywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        sidebarOpen: true,
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        paywallOpen: false,
        openPaywall: () => set({ paywallOpen: true }),
        closePaywall: () => set({ paywallOpen: false }),
      }),
      {
        name: "mock3-ui",
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          toggleSidebar: state.toggleSidebar,
          setSidebarOpen: state.setSidebarOpen,
        }),
      }
    )
  )
);

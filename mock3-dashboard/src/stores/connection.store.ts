import { create } from "zustand";

interface ConnectionState {
  isOffline: boolean;
  setOffline: (value: boolean) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  isOffline: false,
  setOffline: (value: boolean) => set({ isOffline: value }),
}));

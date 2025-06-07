
import { create } from 'zustand';

export const useEtkinlikStore = create((set) => ({
  etkinlikler: [],
  setEtkinlikler: (veri) => set({ etkinlikler: veri }),
}));
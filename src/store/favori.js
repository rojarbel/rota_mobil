
import { create } from 'zustand';

export const useFavoriStore = create((set) => ({
  favoriler: [],

  favoriEkle: (etkinlik) =>
    set((state) => ({
      favoriler: [...state.favoriler, etkinlik],
    })),

  favoriCikar: (id) =>
    set((state) => ({
      favoriler: state.favoriler.filter((e) => e.id !== id),
    })),
}));
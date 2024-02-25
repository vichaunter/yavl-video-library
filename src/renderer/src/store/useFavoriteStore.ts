import { create } from 'zustand';
import { FavoriteList } from '../../../main/handlers/favoriteHandlers';
import api from '../api/apiMedia';

interface FavoriteStore {
  favorites: FavoriteList;
  loading: boolean;
  load: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: {},
  loading: true,
  load: async () => {
    const favorites = await api.getFavorites();
    set({ favorites, loading: false });
  },
  toggleFavorite: async (id: string) => {
    const favorites = await api.toggleFavorite(id);
    set({ favorites });
  },
  isFavorite: (id) => {
    const list = get().favorites;
    return !!list[id];
  },
}));

useFavoriteStore.setState((state) => {
  state.load();
  return state;
});

export default useFavoriteStore;

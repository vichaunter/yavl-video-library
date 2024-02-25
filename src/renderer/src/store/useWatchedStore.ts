import { create, useStore } from 'zustand';
import api from '../api/apiMedia';
import { WatchedList } from '../../../main/handlers/watchedHandlers';

interface WatchedStore {
  watched: WatchedList;
  loading: boolean;
  load: () => void;
  toggleWatched: (id: string) => void;
  isWatched: (id: string) => boolean;
}

const useWatchedStore = create<WatchedStore>((set, get) => ({
  watched: {},
  loading: true,
  load: async () => {
    const watched = await api.getWatched();
    set({ watched, loading: false });
  },
  toggleWatched: async (id: string) => {
    const watched = await api.toggleWatched(id);
    set({ watched });
  },
  isWatched: (id) => {
    const list = get().watched;
    return !!list[id];
  },
}));

useWatchedStore.setState((state) => {
  state.load();
  return state;
});

export default useWatchedStore;

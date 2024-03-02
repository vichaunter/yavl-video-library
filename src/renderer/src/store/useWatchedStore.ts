import { create } from 'zustand';
import { TraktWatched } from '../../../main/handlers/traktHandler';
import { api } from '../api/apiMedia';

interface WatchedStore {
  watched: Record<number, TraktWatched>;
  loading: boolean;
  load: () => void;
  toggleWatched: (id: number) => void;
  isWatched: (id: number) => TraktWatched;
}

const useWatchedStore = create<WatchedStore>((set, get) => ({
  watched: {},
  loading: true,
  load: async () => {
    const watched = await api.getTraktWatched();
    set({ watched, loading: false });
  },
  toggleWatched: async (id: number) => {
    const watched = await api.toggleTraktWatched(id);
    set({ watched });
  },
  isWatched: (id) => {
    const list = get().watched;

    return list[id];
  },
}));

useWatchedStore.setState((state) => {
  state.load();
  return state;
});

export default useWatchedStore;

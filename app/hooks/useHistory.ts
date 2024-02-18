import { create } from "zustand";
import db from "../services/db";

export type HistoryState = {
  history: {
    [key: string]: boolean;
  };
  toggleWatched: (videoId: string) => void;
  isWatched: (videoId: string) => boolean;
  load: () => void;
};

export const useWatchStore = create<HistoryState>((set, get) => ({
  history: {},
  toggleWatched: async (videoId: string) => {
    set((state) => {
      const newHistory = { ...state.history };

      if (!newHistory[videoId]) {
        newHistory[videoId] = true;
      } else {
        newHistory[videoId] = false;
      }
      console.log(newHistory);
      db.put("watchHistory", newHistory as any);

      return { ...state, history: newHistory };
    });
  },
  isWatched: (videoId: string) => get().history[videoId],
  load: async () => {
    const history = (await db.get("watchHistory")) as any;

    return set((state) => ({ ...state, history }), true);
  },
}));

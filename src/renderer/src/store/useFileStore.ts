import { create } from 'zustand';
import MediaModel from '../../../main/models/MovieModel';
import { api } from '../api/apiMedia';

type UseFilesStore = {
  files: MediaModel[];
  loading: boolean;
  loadFolder: (folder: string) => void;
};

const useFilesStore = create<UseFilesStore>((set, get) => ({
  files: [],
  loading: false,
  loadFolder: async (folder) => {
    const files = await api.listFiles(folder);
    if (!files) return;

    set({ loading: true });

    for (let file of files) {
      const info = await api.getMediaInfo(file.fullPath);

      if (!info) continue;
      set({
        files: [...get().files, info],
      });
    }

    set({ loading: false });
  },
}));

export default useFilesStore;

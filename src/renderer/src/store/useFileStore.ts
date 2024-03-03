import { create } from 'zustand';
import MediaModel from '../../../main/models/MovieModel';
import { api } from '../api/apiMedia';
import { find, findIndex } from 'lodash';
import { TMDBId } from '../../../main/handlers/traktHandler';

type UseFilesStore = {
  files: MediaModel[];
  loading: boolean;
  loadFolder: (folder: string) => void;
  getFile: (id: TMDBId) => MediaModel | undefined;
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

      const currentFiles = get().files;
      const index = findIndex(
        get().files,
        (obj) => obj.fileInfo?.fileName === info.fileInfo?.fileName,
      );
      if (index !== -1) {
        currentFiles[index] = info;
      } else {
        currentFiles.push(info);
      }
      set({
        files: currentFiles,
      });
    }

    set({ loading: false });
  },
  getFile: (id) => get().files.find((file) => file.tmdb?.id === id),
}));

export default useFilesStore;

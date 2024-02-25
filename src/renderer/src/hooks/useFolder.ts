import { create } from 'zustand';
import api from '../api/apiMedia';
import { useEffect } from 'react';
import db from '../../../main/services/db';

export type FolderStore = {
  current: string;
  loadLastFolder: () => void;
  setCurrent: (current: string) => void;
};

export const useFolderStore = create<FolderStore>((set, get) => ({
  current: '',
  loadLastFolder: async () => {},
  setCurrent: (current: string) => set((state) => ({ ...state, current })),
}));

const useFolder = () => {
  const [current, setCurrent] = useFolderStore((state) => [
    state.current,
    state.setCurrent,
  ]);

  useEffect(() => {
    if (!current) {
      api.getConfig().then((res) => {
        res.selectedPath && setCurrent(res.selectedPath);
      });
    }
  }, []);

  const openDialog = async () => {
    const folder = await api.openDirectory();
    if (folder) setCurrent(folder);
  };

  return {
    current,
    openDialog,
  };
};

export default useFolder;

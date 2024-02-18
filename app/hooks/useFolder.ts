import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import store from "../services/store";
import { create } from "zustand";
import db from "../services/db";

export type FolderStore = {
  current: string;
  loadLastFolder: () => void;
  setCurrent: (current: string) => void;
};

export const useFolderStore = create<FolderStore>((set, get) => ({
  current: "",
  loadLastFolder: async () => {
    const current = await db.get("lastFolder");
    set((state) => ({ ...state, current }));
  },
  setCurrent: (current: string) => set((state) => ({ ...state, current })),
}));

const useFolder = () => {
  const [current, setCurrent] = useFolderStore((state) => [
    state.current,
    state.setCurrent,
  ]);

  const openDialog = () => {
    ipcRenderer.send("open-directory");
  };

  ipcRenderer.on("selected-directory", (event, selectedPath) => {
    console.log(`Selected Directory: ${selectedPath}`);
    setCurrent(selectedPath);
  });

  return {
    current,
    openDialog,
  };
};

export default useFolder;

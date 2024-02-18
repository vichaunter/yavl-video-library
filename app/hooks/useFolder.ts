import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import store from "../services/store";

const useFolder = () => {
  const [current, setCurrent] = useState<string>();

  useEffect(() => {
    store.getLastFolder().then((lastFolder) => {
      setCurrent(lastFolder);
    });
  }, []);

  const openDialog = () => {
    ipcRenderer.send("open-directory");
  };

  ipcRenderer.on("selected-directory", (event, selectedPath) => {
    console.log(`Selected Directory: ${selectedPath}`);
    setCurrent(selectedPath);
    store.saveLastFolder(selectedPath);
    // Handle the selected path as needed
  });

  return {
    current,
    openDialog,
  };
};

export default useFolder;

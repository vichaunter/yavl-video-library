import { shell } from 'electron';

const openFileHandler = async (fullPath: string): Promise<void> => {
  shell.openPath(fullPath);
};

export default openFileHandler;

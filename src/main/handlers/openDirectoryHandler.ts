import { dialog } from 'electron';
import { mainWindow } from '../main';
import db from '../services/db';

const openDirectoryHandler = async (): Promise<string | undefined> => {
  const result = await dialog.showOpenDialog(mainWindow as any, {
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];

    db.update('config', 'selectedPath', selectedPath);

    return selectedPath;
  }
};

export default openDirectoryHandler;

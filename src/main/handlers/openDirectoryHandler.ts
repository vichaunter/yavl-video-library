import { BrowserWindow, dialog } from 'electron';
import { send } from '.';
import db from '../services/db';

const openDirectoryHandler = async ({ window }: { window: BrowserWindow }) => {
  const result = await dialog.showOpenDialog(window, {
    properties: ['openDirectory'],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];

    db.put('selectedPath', selectedPath);

    return send(selectedPath);
  }
};

export default openDirectoryHandler;

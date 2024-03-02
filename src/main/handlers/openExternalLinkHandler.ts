import { shell } from 'electron';

const openExternalLinkHandler = async (url: string): Promise<void> => {
  shell.openExternal(url);
};

export default openExternalLinkHandler;

import { listFilesRecursively } from '../helpers';

export type File = {
  cleanName: string;
  fullPath: string;
  name: string;
};

const listFilesHandler = async (folder: string): Promise<File[] | void> => {
  if (!folder) return;

  const files = await listFilesRecursively(folder);

  return files;
};

export default listFilesHandler;

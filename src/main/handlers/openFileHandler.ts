import { shell } from 'electron';
import { HandlerRequest } from '.';

export type OpenFileArgs = {
  fullPath: string;
};

export type OpenFileHandler = (
  request: HandlerRequest<OpenFileArgs>,
) => Promise<void>;

const openFile: OpenFileHandler = async (request) => {
  const { fullPath } = request.args;

  shell.openPath(fullPath);
};

export default openFile;

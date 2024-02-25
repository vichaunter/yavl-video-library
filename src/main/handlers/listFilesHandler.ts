import { HandlerResponse, send } from '.';
import { Media, listFilesRecursively } from '../helpers';

export type ListFilesResponse = HandlerResponse<Media[]>;

type Props = {
  args: {
    folder: string;
  };
};
const listFilesHandler = async ({ args }: Props) => {
  const { folder } = args;
  if (!folder) return send({ status: 400, error: 'missing folder argument' });

  const files = await listFilesRecursively(folder);

  return send(files);
};

export default listFilesHandler;

import MediaModel from '../models/MovieModel';

type Props = {
  args: {
    fullPath: string;
  };
};

export const getMediaInfoHandlerV2 = async (
  fullPath: string,
): Promise<MediaModel> => {
  if (!fullPath)
    return { status: 400, error: 'missing fullPath argument' } as any;

  const media = new MediaModel();
  await media.load({ fullPath });

  return media;
};

const getMediaInfoHandler = async ({ args }: Props) => {
  const { fullPath } = args;
  if (!fullPath) return { status: 400, error: 'missing fullPath argument' };

  const media = new MediaModel();
  await media.load({ fullPath });

  return media;
};

export default getMediaInfoHandler;

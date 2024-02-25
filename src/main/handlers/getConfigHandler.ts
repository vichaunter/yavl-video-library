import { send } from '.';
import db from '../services/db';
import { ApiConfigResponse } from '../types';

type Props = {
  args: {
    folder: string;
  };
};
const getConfigHandler = async ({ args }: Props) => {
  const config: ApiConfigResponse['data'] = {
    selectedPath: '',
  };

  try {
    config.selectedPath = await db.get('selectedPath');
  } catch (e) {
    console.log(e);
  }

  return send(config);
};

export default getConfigHandler;

import { send } from '.';
import MediaModel from '../models/MovieModel';

/*
{
  fullpath: 'T:\\BAJADAS\\@PELIS\\13 exorcismos [BluRay 1080p][AC3 5.1 Castellano DTS 5.1-Castellano+Subs][ES-EN]\\13 exorcismos BD1080.atomohd.casa.mkv',
  filename: '13 exorcismos BD1080.atomohd.casa.mkv',
  title: '13 exorcismos',
  year: '',
  width: 1920,
  height: 804,
  size: 14132809319,
  duration: 6207.552,
  quality: '1080',
  codecName: 'h264',
  codecLongName: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
  formatName: 'matroska,webm',
  formatLongName: 'Matroska / WebM',
  audio: [
    {
      codecName: 'dts',
      codecLongName: 'DCA (DTS Coherent Acoustics)',
      channelLayout: '7.1',
      language: 'spa'
    },
    {
      codecName: 'ac3',
      codecLongName: 'ATSC A/52A (AC-3)',
      channelLayout: '5.1(side)',
      language: 'spa'
    }
  ],
  subtitle: [ { language: 'spa', title: '' }, { language: 'eng', title: '' } ]
}*/
// function ffmpegSync(path: string): Promise<Record<string, any>> {
//   return new Promise((resolve, reject) => {
//     extractVideoInformations(path)
//       .then((data: any) => {
//         resolve(data);
//       })
//       .catch((err) => reject(err));
//   });
// }

// const queue = new RequestQueue();
// async function fetchInfo(name: string) {
//   const result = await search(name);
//   if (result) {
//     db.put(`${name}`, result as any);
//   }
//   return result;
// }
type Props = {
  args: {
    fullPath: string;
  };
};

const getMediaInfoHandler = async ({ args }: Props) => {
  const { fullPath } = args;
  if (!fullPath)
    return send({ status: 400, error: 'missing fullPath argument' });

  const media = new MediaModel();
  await media.load({ fullPath });
  // const data = await ffmpegSync(fullPath);
  // const file = fs.statSync(fullPath);
  // const fileName = path.basename(fullPath);
  // const fileExt = path.extname(fullPath);
  // const cleanName = getCleanName(fileName);

  // let dbInfo;
  // try {
  //   dbInfo = await db.get(`${cleanName}`);
  // } catch (e) {
  //   await db.del(`${cleanName}`);
  // }

  // let tmdb: any = dbInfo ?? {};
  // try {
  //   if (!tmdb.title) {
  //     const res = await queue.run(async () => fetchInfo(cleanName));
  //     if (res) tmdb = res;
  //   }
  // } catch (e) {
  //   console.log(e);
  // }

  return send(media);
};

export default getMediaInfoHandler;

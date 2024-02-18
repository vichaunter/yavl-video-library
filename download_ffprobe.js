const { promisify } = require('util');
const { downloadBinaries } = require('ffbinaries');

async function initFFLibraries() {
  console.log('Checking ffprobe binary');
  const [{ status }] = await promisify(downloadBinaries)(['ffprobe'], { destination: './bin' });
  return status;
}

initFFLibraries()
  .then((status) => console.log(status))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

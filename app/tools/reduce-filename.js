import { basename, extname } from 'path';

const reduceFilename = function (fileName) {
  const extension = extname(fileName);
  const name = basename(fileName, extension);
  if (name.length > 30) {
    const begin = name.substr(0, 21);
    const rest = name.substr(21).substr(-6);
    return `${begin}...${rest}${extension}`;
  }
  return fileName;
};

export default reduceFilename;

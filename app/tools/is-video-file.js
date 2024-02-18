const extensions = ['mp4', 'avi', 'mkv'];

const isVideoFile = (() => {
  const re = new RegExp(`.(${extensions.join('|')})$`, 'i');
  return (file) => !!file.match(re);
})();

export default isVideoFile;

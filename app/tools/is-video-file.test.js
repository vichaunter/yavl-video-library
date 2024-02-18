import isVideoFile from './is-video-file';

test('matching extension', () => {
  expect(isVideoFile('file.mkv')).toBe(true);
});

test('matching extension case insensitive', () => {
  expect(isVideoFile('file.MKV')).toBe(true);
});

test('not matching extension', () => {
  expect(isVideoFile('file.mp3')).toBe(false);
});

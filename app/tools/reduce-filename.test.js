import reduceFilename from './reduce-filename';

test('keep untouched short filename', () => {
  const fileName = 'any file.pdf';
  const expected = fileName;
  expect(reduceFilename(fileName)).toBe(expected);
});

test('reduce long filenames', () => {
  const fileName = 'A really really long long name of file.pdf';
  const expected = 'A really really long ...f file.pdf';
  expect(reduceFilename(fileName)).toBe(expected);
});

test('real case', () => {
  const fileName = 'Adventures of Rocky and Bullwinkle and Friends, The (U) [!].nes';
  const expected = 'Adventures of Rocky a...U) [!].nes';
  expect(reduceFilename(fileName)).toBe(expected);
});

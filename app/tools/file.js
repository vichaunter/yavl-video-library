export function removeExtension(file) {
  return file.split(".").slice(0, -1).join(".");
}

const INVALID = [
  "atomixhq art",
  "pelicula para",
  "atomod cash",
  "atomixhq one",
  "atomixhq net",
  "atomohd cc",
  "atomohd surf",
  "descargas2020 org",
  "BDR1080",
  "BD1080",
  "M1080",
  "4Krip2160",
  "microhd",
  "4k2160",
  "ESDLA",
  "dvdrip",
  "dvd",
  "cd1",
  "cd2",
  "pctmix1",
  "pctfenix",
  "pctnew",
  "pctmix",
  "newpct",
  "atomixhq",
  "atomohd",
  "descargas2020",
  "4Kremux2160",
  "link",
  "xvid",
];

export function getCleanName(filename, isPath) {
  if (isPath) filename = filename + ".path";
  let standard = filename.match(/(.*)\.\(?\d{4}\)?\./); // https://en.wikipedia.org/wiki/Standard_(warez)
  if (!standard) {
    standard = filename.match(/(.*) \(\d{4}\)/); // variant like "Name (date) tags.ext"
  }
  const source = standard ? standard[1] : removeExtension(filename);
  const invalidRegex = new RegExp(INVALID.join("|"), "gi");

  return source
    .replace(/\[[^\]]+\]/g, " ") // remove content in brackets
    .replace(/\([^)]+\)/g, " ") // remove content in parenthesis
    .replace(/www\.(?:\w+\.)(com|org|net|cash|link)/gi, "") //remove urls
    .replace(/\.com/, "")
    .replace(/\./g, " ")
    .replace(invalidRegex, "")
    .replace(/(^\s*\d{4}\s*-)|(-\s*\d{4}\s*$)/, "") // remove starting or ending date (2018 - XXX) or (XXX - 2018)
    .replace(/\s+/, " ")
    .trim();
}

export function getYear(filename) {
  let match = filename.match(/.+\.\(?(\d{4})\)?\./); // https://en.wikipedia.org/wiki/Standard_(warez)
  if (!match) {
    match = filename.match(/.+\((\d{4})\).*/); // variant like "Name (date) tags.ext"
  }
  if (!match) {
    match = filename.match(/.+ - (\d{4}) - .+/); // variant like "Name - date - tags.ext"
  }
  if (match) {
    return match[1];
  }
  const name = removeExtension(filename)
    .replace(/\[[^\]]*]/g, " ") // remove content in bracket
    .trim();
  const year = name.match(/^(\d{4})\s*-/) || name.match(/-\s*(\d{4})$/); // starting or ending date
  if (year) {
    return year[1];
  }
  return "";
}

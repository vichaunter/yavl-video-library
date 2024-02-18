import searchOnTMDB from "../tools/tmdb";
import { filterNoNamedLanguages } from "../helpers";
import extractVideoInformations from "../tools/ffprobe";

export const fetchMovieData = async (filePath, altTitle) => {
  const informations = await extractVideoInformations(filePath);
  informations.audio = filterNoNamedLanguages(informations.audio);
  informations.subtitle = filterNoNamedLanguages(informations.subtitle);

  let tmdb = await searchOnTMDB(informations.title, informations.year);
  if (!tmdb && altTitle) {
    tmdb = await searchOnTMDB(altTitle, informations.year);
  }
  return { ...informations, tmdb };
};

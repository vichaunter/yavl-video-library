import Semaphore from "./semaphore";

const https = require("https");

const API_KEY = "f090bb54758cabf231fb605d3e3e0468"; // kodi public key
const semaphore = new Semaphore(1);

const request = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (resp) => {
        let data = "";

        resp.on("data", (chunk) => {
          data += chunk;
        });

        resp.on("end", () => {
          resolve(JSON.parse(data));
        });
      })
      .on("error", reject);
  });

/**
 * @typedef TMDBImagesConfig
 * @type {object}
 * @property {string} base_url
 * @property {string} secure_base_url
 * @property {string[]} backdrop_sizes
 * @property {string[]} logo_sizes
 * @property {string[]} poster_sizes
 * @property {string[]} profile_sizes
 * @property {string[]} still_sizes
 */

/**
 * TMDB Image Configuration object
 * @type {TMDBImagesConfig}
 */
let tmdbIimageConfig = null;

async function loadConfig() {
  tmdbIimageConfig = await request(
    `https://api.tmdb.org/3/configuration?api_key=${API_KEY}`
  );
}

/**
 * Forge TMDB image full URL
 * @param {string} path
 * @param {string[]} sizes
 * @returns {string|undefined}
 */
function forgeImageFullPath(path, sizes) {
  if (path) {
    return `${tmdbIimageConfig.images.base_url}${
      sizes[sizes.length - 2]
    }${path}`;
  }
  return undefined;
}

/**
 * @typedef TMDBResult
 * @type {object}
 * @property {number} id
 * @property {number} popularity
 * @property {number} vote_count
 * @property {number} vote_average
 * @property {string} title
 * @property {string} overview
 * @property {string} release_date
 * @property {string} original_language
 * @property {string} original_title
 * @property {number[]} genre_ids
 * @property {boolean} video
 * @property {boolean} adult
 * @property {string} [poster_path]
 * @property {string} [logo_path]
 * @property {string} [backdrop_path]
 */

/**
 * Search for a movie informations on TMDB
 * @param {string} name
 * @param {string} [year]
 * @returns {Promise<null|TMDBResult>}
 */
async function search(name, year) {
  const release = await semaphore.acquire();
  let result = null;
  try {
    if (!tmdbIimageConfig) {
      await loadConfig();
    }
    const { results } = await request(
      `https://api.tmdb.org/3/search/movie?api_key=${API_KEY}&language=es&query=${encodeURIComponent(
        name
      )}${year ? `&year=${year}` : ""}`
    );

    if (results?.length) {
      if (year) {
        result = results
          .filter(
            (item) =>
              (item.release_date || "").split("-").shift() === year.toString()
          )
          .shift();
      }
      if (!result) {
        [result] = results;
      }
    }

    if (result) {
      result.backdrop_path = forgeImageFullPath(
        result.backdrop_path,
        tmdbIimageConfig.images.backdrop_sizes
      );
      result.logo_path = forgeImageFullPath(
        result.logo_path,
        tmdbIimageConfig.images.logo_sizes
      );
      result.poster_path = forgeImageFullPath(
        result.poster_path,
        tmdbIimageConfig.images.poster_sizes
      );
    }
  } catch (err) {
    // swallow
  }
  release();
  return result;
}

export default search;

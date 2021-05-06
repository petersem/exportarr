const axios = require("axios");
const csl = require("./customStephenLu");

/**
 * @desc Used to communicate with Radarr to obtain a list of future releases
 * @param radarrUrl
 * @param radarrToken
 */
class Radarr {
  constructor(radarrUrl, radarrToken) {
    this.radarrUrl = radarrUrl;
    this.radarrToken = radarrToken;
    this.genreList = [];
  }

  /**
   * @desc Gets the movie titles that fall within the range specified
   * @param {string} startDate - in yyyy-mm-dd format - Generally todays date
   * @param {string} endDate - in yyyy-mm-dd format - future date
   * @returns {Promise<object>} json results - results of search
   */
  async GetMoviesRawData() {
    let response;
    try {
      response = await axios
        .get(
          this.radarrUrl +
            "/api/v3/movie?apikey=" +
            this.radarrToken
        )
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      let d = new Date();
      console.log(d.toLocaleString() + " *Radarr - Get movies raw data:", err.message);
      throw err;
    }
    return response;
  }

  
  /**
   * @desc Get Movie coming soon data and formats into mediaCard array
   * @param {string} startDate - in yyyy-mm-dd format - Generally todays date
   * @param {string} endDate - in yyyy-mm-dd format - future date
   * @returns {Promise<object>} mediaCards array - results of search
   */
  async GetMovies(genre) {
    if(genre == undefined) genre = '';
    let raw;
    // get raw data first
    try{
      raw = await this.GetMoviesRawData();
    }
    catch(err){
      let d = new Date();
      console.log(d.toLocaleString() + " *Radarr - Get Raw Data: " + err);
      throw err;
    }

    // reutrn an empty array if no results
    let customList = [];
    if (raw != null) {
      // move through results and populate media cards

      await raw.data.reduce(async (memo, md) => {
        await memo;
        let cslEntry;
        //if(md.genres !== undefined){
          if(md.genres.filter(obj =>
            obj.toLowerCase().indexOf(genre.toLowerCase()) >= 0).length > 0){
              cslEntry = new csl();
              cslEntry.imdb_id = md.imdbId;
              cslEntry.release_date = md.year;
              cslEntry.tmdb_id = md.tmdbId;
              cslEntry.title = md.title;
              cslEntry.genres = md.genres.join().toLowerCase().replace(/\s/g, '');
              let posterUrl = '';
              if(md.images[0] !== undefined) {
                posterUrl = md.images[0].remoteUrl;
              }
              cslEntry.poster_path = posterUrl;
              
              customList.push(cslEntry);
          }

          // add to distinct genreList
          md.genres.forEach(genre => {
            let modGenre = genre.replace(/\s/g, '');
            if(!this.genreList.includes(modGenre)) {
              this.genreList.push(modGenre);
            }
          });

        //}
      }, undefined);
    }

    return await Promise.resolve(customList);
  }
}

module.exports = Radarr;

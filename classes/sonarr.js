const axios = require("axios");
const csl = require("./customStephenLu");

/**
 * @desc Used to communicate with Radarr to obtain a list of future releases
 * @param sonarrUrl
 * @param sonarrToken
 */
class Sonarr {
  constructor(sonrrUrl, sonarrToken) {
    this.sonarrUrl = sonarrUrl;
    this.sonarrToken = sonarrToken;
    this.genreList = [];
  }

  /**
   * @desc Gets the show titles
   * @returns {Promise<object>} json results - results of search
   */
  async GetTVRawData() {
    let response;
    try {
      response = await axios
        .get(
          this.radarrUrl +
            "/api/series?apikey=" +
            this.radarrToken
        )
        .catch((err) => {
          throw err;
        });
    } catch (err) {
      let d = new Date();
      console.log(d.toLocaleString() + " *Sonarr - Get series raw data:", err.message);
      throw err;
    }
    return response;
  }

  
  /**
   * @desc Get series 
   * @returns {Promise<object>} mediaCards array - results of search
   */
  async GetSeries(genre) {
    if(genre == undefined) genre = '';
    let raw;
    // get raw data first
    try{
      raw = await this.GetSeriesRawData();
    }
    catch(err){
      let d = new Date();
      console.log(d.toLocaleString() + " *Sonarr - Get Raw Data: " + err);
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
              cslEntry.tmdb_id = md.tvdbId;
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


const express = require("express");
const path = require("path");
const app = express();
const radarr = require("./classes/radarr");
const sonarr = require("./classes/sonarr");
let movies = "";
let shows = "";
let distinctMovieGenres = [];
let distinctShowGenres = [];
const radarrToken = process.env.RADARR_TOKEN;
const radarrUrl = process.env.RADARR_URL;
const sonarrToken = process.env.SONARR_TOKEN;
const sonarrUrl = process.env.SONARR_URL;
const token = process.env.TOKEN || "";


let movieClock;
let showClock;

async function GetMovies(genre) {
    clearInterval(movieClock);
    console.log('✅ Starting process to get movie data for lists');
    let rdr = new radarr(radarrUrl, radarrToken);
    movies = await rdr.GetMovies(genre);
    console.log(movies.length, "matching movies returned");
    distinctMovieGenres = await Promise.resolve(rdr.genreList.sort());
    console.log('✅ Movie genre list created');
    console.log('✅ Exportarr is ready for use for movies!');
    setInterval(GetMovies, 86400000); // daily run
    return await Promise.resolve(movies);
}

async function GetShows(genre) {
    clearInterval(showClock);
    console.log('✅ Starting process to get show data for lists');
    let son = new sonarr(sonarrUrl, sonarrToken);
    shows = await son.GetSeries(genre);
    console.log(shows.length, "matching shows returned");
    distinctShowGenres = await Promise.resolve(son.genreList.sort());
    console.log('✅ Shows genre list created');
    console.log('✅ Exportarr is ready for use for shows!');
    setInterval(GetShows, 86400000); // daily run
    return await Promise.resolve(shows);
}


// main call to get all movies
if(radarrUrl != null && radarrToken != null){
    GetMovies();
}
else{
    console.log('Radarr not enabled')
}

// get shows
if(sonarrUrl != null && sonarrToken != null){
    GetShows();
}
else{
    console.log('Sonarr not enabled')
}

//use ejs templating engine
app.set("view engine", "ejs");

// Express settings
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
  express.json()
);

// sets public folder for assets
app.use(express.static(path.join(__dirname, "public")));

// set routes
app.get("/", (req, res) => {
    if(req.query.token !== token && token !== ""){
        res.sendStatus(401);
    }
    else{
        res.render('index',{radarr: distinctMovieGenres, sonarr: distinctShowGenres, token: token});
    }
});

app.get("/radarr", (req, res) => {
    //console.log(req.query.token);
    if(req.query.token !== token && token !== ""){
        res.sendStatus(401);
    }
    else{
        res.json(movies);
    }
});

app.get("/radarr/:genre", (req, res) => {
    console.log(req.query.token);
    if(req.query.token !== token && token !== ""){
         res.sendStatus(401);
    }
    else{
        const filteredMovies = movies.filter(function(item){
            return item.genres.includes(req.params.genre.toLowerCase()) == true;
        });
        //console.log(filteredMovies);
        res.json(filteredMovies);
    }
});

app.get("/sonarr", (req, res) => {
    if(req.query.token !== token && token !== ""){
        res.sendStatus(401);
    }
    else{
        res.json(shows);
    }
  });

  app.get("/sonarr/:genre", (req, res) => {
    console.log(req.query.token);
    if(req.query.token !== token && token !== ""){
         res.sendStatus(401);
    }
    else{
        const filteredShows = shows.filter(function(item){
            return item.genres.includes(req.params.genre.toLowerCase()) == true;
        });
        res.json(filteredShows);
    }
});


// start listening on port 3000
app.listen(3000, () => {
    console.log(`✅ Web server started on internal port 3000 `);
  });
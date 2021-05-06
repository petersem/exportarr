
const express = require("express");
const path = require("path");
const app = express();
const radarr = require("./classes/radarr");
let movies = "";
let distinctGenres = [];
const radarrToken = process.env.RADARR_TOKEN;
const radarrUrl = process.env.RADARR_URL; 
const token = process.env.TOKEN || "xyzzy";

let movieClock;

async function GetMovies(genre) {
    clearInterval(movieClock);
    console.log('✅ Starting process to get movie data for lists');
    let rdr = new radarr(radarrUrl, radarrToken);
    movies = await rdr.GetMovies(genre);
    console.log(movies.length, "matching movies returned");
    distinctGenres = await Promise.resolve(rdr.genreList.sort());
    console.log('✅ Movie genre list created');
    console.log('✅ Exportarr is ready for use!');
    setInterval(GetMovies, 86400000); // daily run
    return await Promise.resolve(movies);
}

// main call to get all movies
GetMovies();

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
        res.render('index',{radarr: distinctGenres, token: token});
    }
});

app.get("/radarr", (req, res) => {
    console.log(req.query.token);
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
        res.render("radarr", { movies: rdr.GetMovies() }); // index refers to index.ejs
    }
  });

// start listening on port 3000
app.listen(3000, () => {
    console.log(`✅ Web server started on internal port 3000 `);
  });
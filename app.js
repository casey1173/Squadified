//#region import modules
const express = require("express")
const https = require("https")
const helmet = require("helmet")
const fs = require("fs")
const axios = require("axios")
const qs = require("querystring")
const cors = require("cors")()

const Song = require('./Song.js');


//const bodyParser = require('body-parser');


const app = express()
//#endregion
//app.use(bodyParser.json());


const spotifyClientID = "e877e6ffc92f4caca0352895fa830224"
const spotifySecret = "8bde01a0227440f6910fe671615e03c8"
const authReq = "Basic " + Buffer.from(spotifyClientID + ":" + spotifySecret).toString("base64")
let currToken = {}


const sslOptions = {
    //where certbot put our letsencrypt private and public keys
    key: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/fullchain.pem")
}

// setting up a service on the default https port. Pass in our SSL credentials as well as our express app to actually respond to requests
https.createServer(sslOptions, app).listen(443)

app.listen(80) //Have an http port open for first time contact
app.use(helmet.hsts()) //Use helmet http strict transport security to force https

app.use(express.static("/var/www/squadified/public")) //static files like index.html 
app.use(cors)


let updateToken = () => {
    axios(
    {
        url: "https://accounts.spotify.com/api/token",
        method: "post",
        headers: {
            "Authorization": authReq.toString(),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
            "grant_type": "client_credentials"
        })
    })
    .then((response) => {
        currToken.code = response.data.access_token
        currToken.expiresAt = Date.now() + response.data.expires_in * 1000
        console.log("fetched new token.")
    })
    .catch((error) => {
        console.log(error)
    })
}

updateToken()
setInterval(updateToken, 3600 * 1000)

app.get("/token", (req, res) => {
    res.send(currToken)
})

app.get("/example", (req, res) => {
    res.send("example ajax method")
})

app.post("/song", (req, res) => {
    let {sid, name, artist} = req.data;
    let s = Song.create(req.data.sid, req.data.name, red.data.artist);
    if (s == null) {
        res.status(400).send("Bad Request");
        return;
    }
    return res.json(s);
})

app.get("/songs", (req, res) => {
    //console.log("testing hello can u see me")
    //console.log(req.params)
    //console.log(req.query)
    //console.log("testing hello can u see me too ?")
    //console.log("songs req params: ", req.params);
    //console.log("songs req query: ", req.query);
    let sIds = ((req.query).ids).split(',');
    console.log('testing! Inside /songs')
    //console.log(sIds);
    //let sNames = ((req.query).names).split(',');
    let songFeatures = [];
    let spotifySongs = [];
    sIds.forEach(function(sid) {
        songData = Song.findByID(sid);
        if (songData != null) {
            songFeatures.push(songData.features)
        } else {
            spotifySongs.push(sid);
        }
    })
    //console.log("stored songs: ", storedSongs)
    //console.log("spotify songs: ", spotifySongs)
    console.log(req.headers.authorization);
    //console.log(spotifySongs.join(","))

    if (spotifySongs != []) {
        axios.get("https://api.spotify.com/v1/audio-features", {
            headers: {"Authorization": req.headers.authorization},
            params: {"ids": spotifySongs.join(",")}
        }).then((response) => {
            //console.log("spotify response: ", response)
            const features = response.data.audio_features;
            //console.log("spotify features: ", features)
            //console.log("spotifySongs: ", spotifySongs)
            Song.createSongs(spotifySongs)
            Song.addFeatures(spotifySongs, features)
            songFeatures.push(...features)
            res.send(songFeatures)
        })
        /*
        const features = (axios({
            method: "get",
            url: "https://api.spotify.com/v1/audio-features",
            headers: req.headers.authorization,
            params: {"ids": spotifySongs.join(",")}
        })).data.audio_features 
        Song.createSongs(spotifySongs)
        Song.addFeatures(spotifySongs, features)
        storedSongs.push(...features)*/
    } else {
        console.log("all songs in database already")
        res.send(songFeatures)
    }
    //console.log("returned features list: ", storedSongs)
    
    //return songFeatures;    
    //res.json(s);
});
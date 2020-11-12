//#region import modules
const express = require("express")
const https = require("https")
const helmet = require("helmet")
const fs = require("fs")
const axios = require("axios")
const app = express()
//#endregion

const spotifyClientID = "e877e6ffc92f4caca0352895fa830224"
const spotifySecret = "8bde01a0227440f6910fe671615e03c8"
const authReq = "Basic " + Buffer.from(spotifyClientID + ":" + spotifySecret).toString("base64")
let currToken = ""

const sslOptions = {
    //where certbot put our letsencrypt private and public keys
    key: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/fullchain.pem")
}


https.createServer(sslOptions, app).listen(443)
app.listen(80) //Have an http port open for first time contact
app.use(helmet.hsts()) //Use helmet http strict transport security to force https
app.use(express.static("/var/www/squadified/public")) //static files

/*
let updateToken = async function () {
    const tokenRes = axios.post({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        headers: { "Authorization": authReq },
        data: {
            "grant_type": "client_credentials"
        }
    })
    currToken = tokenRes
    console.log("fetched new token")
}

updateToken()
*/

app.get("/authReq", (req, res) => {
    res.send(authReq)
})


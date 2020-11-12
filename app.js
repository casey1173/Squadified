//#region import modules
const express = require("express")
const https = require("https")
const helmet = require("helmet")
const fs = require("fs")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const querystring = require("querystring")
const request = require("request")

const client_id = 'e877e6ffc92f4caca0352895fa830224'; // Your client id
const client_secret = '8bde01a0227440f6910fe671615e03c8'; // Your secret
const redirect_uri = 'http://squadified.com/callback'; // Your redirect uri
const stateKey = "spotify_auth_state"
//#endregion

const sslOptions = {
    //where certbot put our letsencrypt private and public keys
    key: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/fullchain.pem")
}

//#region setup an https server which uses our express app as a callback
https.createServer(sslOptions, app).listen(443)
app.listen(80) //Have an http port open for first time contact
app.use(helmet.hsts()) //Use helmet http strict transport security to force https
app.use(express.static("/var/www/squadified/public")) //static files
app.use(cors())
app.use(cookieParser())
//#endregion


app.get("/login", (req, res) => {

    const state = generateRandomString(16)
    res.cookie(stateKey, state)
    const query = {
        response_type: 'code',
        client_id: client_id,
        scope: "user-read-private user-read-email",
        redirect_uri: redirect_uri,
        state: state
    }
    res.redirect(`https://accounts.spotify.com/authorize?` + querystring.stringify(query))

})

app.get("/callback", (req, res) => {
    const code = req.query.code || null
    const state = req.query.state || null
    const storedState = req.cookies ? req.cookies[stateKey] : null

    if (state === null || state !== storedState) {
        res.redirect("/#" + querystring.stringify({ error: "state_mismatch" }))
    } else {
        res.clearCookie(stateKey)
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            headers: {
                "Authorization": "Basic " + new Buffer.from(client_id + ":" + client_secret).toString("base64")
            },
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: "authorization_code"
            },
            json: true
        }
        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token,
                    refresh_token = body.refresh_token

                const options = {
                    url : "https://api.spotify.com/v1/me",
                    headers: { "Authorization": "Bearer " + access_token },
                    json: true
                }

                request.get(options, (error, response, body) => {
                    console.log(body)
                })

                res.redirect("/#" + querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }))
            } else {
                res.redirect("/#" + querystring.stringify({ error: "invalid_token" }))
            }
        })
    }

})

app.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });

const generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};


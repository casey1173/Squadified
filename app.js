//#region import modules
const express = require("express")
const https = require("https")
const helmet = require("helmet")
const fs = require("fs")
const cookieSession = require("cookie-session")
const passport =  require("passport")
const isLoggedIn = require("./middleware/auth")
const app = express()
require("./passport")

//#endregion


const sslOptions = {
    //where certbot put our letsencrypt private and public keys
    key: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/fullchain.pem")
}


https.createServer(sslOptions, app).listen(443)
app.listen(80) //Have an http port open for first time contact
app.use(helmet.hsts()) //Use helmet http strict transport security to force https
app.use(express.static("/var/www/squadified/public")) //static files
app.use(cookieSession({
    name: "spotify-auth-session",
    keys: ["key1", "key2"]
}))
app.use(passport.initialize())
app.use(passport.session())



app.get("/me", isLoggedIn, (req, res) =>{
    res.send(`Good morning spotify user: ${req.user.displayName}`)
})

app.get('/auth/error', (req, res) => res.send('Unknown Error'))

app.get('/auth/spotify',passport.authenticate('spotify'))

app.get('/auth/spotify/callback',passport.authenticate('spotify', { failureRedirect: '/auth/error' }),
function(req, res) {
  res.redirect('/');
});

app.get("/logout", (req, res) => {
    req.session = null
    req.logOut()
    res.redirect("/")
})
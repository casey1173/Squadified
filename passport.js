const passport = require("passport")
const SpotifyStrategy = require('passport-spotify').Strategy


const authStrategy = new SpotifyStrategy({
    clientID: 'e877e6ffc92f4caca0352895fa830224', // Your client id
    clientSecret: '8bde01a0227440f6910fe671615e03c8', // Your secret
    callbackURL: 'https://www.squadified.com/auth/spotify/callback', // Your redirect uri
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    })

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})

passport.use(authStrategy)
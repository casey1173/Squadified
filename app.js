const express = require("express")
const https = require("https")
const helmet = require("helmet")
const fs = require("fs")
const app = express()

const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/fullchain.pem")
}

https.createServer(sslOptions, app).listen(443)

app.listen(80)
app.use(helmet.hsts())
app.use(express.static("/var/www/squadified/public"))
app.get("/xhr", (req, res) => {
    console.log("incoming request from:\t ", req.headers.origin)
    res.writeHead(200)
    res.end("hello world")
})
const express = require("express")
const https = require("https")
const fs = require("fs")
app = express()

const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/www.squadified.com/fullchain.pem")
}

app.use(express.static("public"))

app.get("/hw", (req, res) => {
    res.writeHead(200)
    res.end("hello world")
})

https.createServer(sslOptions, app).listen(80)
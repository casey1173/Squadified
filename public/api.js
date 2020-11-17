currToken = undefined
getCurrToken = async function () {
    if (currToken == undefined || Date.now() >= currToken["expiresAt"]) {
        let res = await axios.get("https://www.squadified.com/token")
        currToken = res.data
        return currToken
    } else {
        return currToken
    }
}

getResource = async function (path) {
    return (await axios({
        method: "get",
        url: `https://api.spotify.com/v1/` + path,
        headers: { "Authorization": `Bearer ${(await getCurrToken()).code}` }
    })).data
}

getTopArtists = async function (userName) {
    const playlists = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/users/${userName}/playlists`,
        headers: { "Authorization": `Bearer ${(await getCurrToken()).code}` }
    })

    let artists = []

    playlists.data.items.forEach(async function (pl) {
        const songs = await axios({
            method: "get",
            url: `https://api.spotify.com/v1/playlists/${pl.id}/tracks`,
            headers: { "Authorization": `Bearer ${(await getCurrToken()).code}` }
        })
        songs.data.items.forEach(s => {
            if (s.track != null) {
                songArtists = s.track.artists.map((a) => {
                    return { name: a.name, id: a.uri.split(":")[2] }
                })
                artists.push(...songArtists)
            }

        })
    })
    return artists
}


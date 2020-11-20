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

getUser = async function (username) {
    userObject = (await axios({
        method: "get",
        url: `https://api.spotify.com/v1/users/${username}`,
        headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`}
    })).data

    return userObject
}

getPlaylists = async function (username) {

    let playlists = []
    let offset = 0
    const limit = 20

    do {
        playlistResponse = (await axios({
            method: "get",
            url: `https://api.spotify.com/v1/users/${username}/playlists`,
            headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`},
            params: {"offset": offset, "limit": limit}
        })).data

        playlists.push(...(playlistResponse.items))
        offset += limit
    } while (playlists.length < playlistResponse.total)
    return playlists
}

getSongs = async function (playlists) {
    let songs = []
    for (const pl of playlists) {
        let offset = 0
        const limit = 100
        let trackList = []
        let i = playlists.indexOf(pl)
        do {
            const response = (await axios({
                method: "get",
                url: `https://api.spotify.com/v1/playlists/${playlists[i].id}/tracks`,
                headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`},
                params: {
                    "fields": "items(track.id, track.name)",
                    "offset": offset,
                    "limit": limit,
                }
            })).data.items
            trackList.push(...response)
            offset += limit

        }while(trackList.length < playlists[i].tracks.total)//trackList.length < playlists[i].tracks.total

        songs.push(...trackList)

    }
    songs = songs.map((s, i) => {
        return songs[i].track
    })
    return songs
}

getSongFeatures = async function (songs) {
    let songIDs = (await songs).map(s => s.id)
    let featuresArray = []

    if (songIDs.length > 100) {
        let chunkedSongIDs = _.chunk(songIDs, 100)
        chunkedSongIDs.forEach(async (ch, i) => {
            const features = (await axios({
                method: "get",
                url: "https://api.spotify.com/v1/audio-features",
                headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`},
                params: {"ids": chunkedSongIDs[i].join(",")}
            })).data
            featuresArray.push(...features.audio_features)
        })

    } else {
        const features = (await axios({
            method: "get",
            url: "https://api.spotify.com/v1/audio-features",
            headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`},
            params: {"ids": songIDs.join(",")}
        })).data.audio_features
        featuresArray.push(...features)
    }
    return featuresArray
}


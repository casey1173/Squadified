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

getSongs = async function (playlist) {

    //test if songs exist in database and return; if not, pull from spotify
    let songs = []
    let offset = 0
    const limit = 100
    console.log(playlist)
    const response = (await axios({
        method: "get",
        url: `https://api.spotify.com/v1/playlists/${playlist[0].id}/tracks`,
        headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`},
        params: {
            "fields": "items(track.id, track.name)",
            "offset": offset,
            "limit": limit,
        }
    })).data.items
    songs.push(...response)


    songs = songs.map((s, i) => {
        return songs[i].track
    })
    return songs
}

getSongFeatures = async function (songs) {
    let songIDs = (await songs).map(s => s.id)
    let featuresArray = []

    songIDs.splice(100)

    const features = (await axios({
        method: "get",
        url: "https://api.spotify.com/v1/audio-features",
        headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`},
        params: {"ids": songIDs.join(",")}
    })).data.audio_features
    featuresArray.push(...features)

    return featuresArray
}

getRecomendation = async function(seedTracks, targetFeatures){
    const response = await axios({
        url: "https://api.spotify.com/v1/recommendations",
        method: "get",
        headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`},
        params: {
            "seed_tracks" : seedTracks,
            "target_energy": targetFeatures.energy,
            "target_valence": targetFeatures.valence,
            "target_danceability": targetFeatures.danceability,
            "target_acousticness": targetFeatures.acousticness
        }
    })
    return response.data
}


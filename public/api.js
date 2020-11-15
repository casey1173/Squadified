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

getArtists = async function(userName){
    const playlists = await axios({
        method: "get",
        url: `https://api.spotify.com/v1/users/${userName}/playlists`,
        headers: {"Authorization": `Bearer ${(await getCurrToken()).code}`}
    })
    console.log(playlists.data)
}


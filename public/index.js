window.onload = async () => {

    const userName = document.getElementById("userCode")
    const artistList = document.getElementById("artists")
    const butt = document.getElementById("getArtists")

    butt.addEventListener("click", async (e) => {
        let artists = getTopArtists(userName.value)
        console.log(artists)
    })
}




window.onload = async () => {
    const typeField = document.getElementById("type-field")
    const idField = document.getElementById("id-field")
    const result = document.getElementById("result")
    const butt = document.getElementById("request-button")
    

    const currToken = await fetch("https://www.squadified.com/token")

    const spotifyAPI = axios.create({
        method: "get",
        baseURL: "https://api.spotify.com/v1",
        headers: {"Authorization" : "Bearer " + currToken}
    })

    butt.addEventListener("click", async (e) => {
        const apiRes = await spotifyAPI.get(`/${typeField.value}/${idField.value}`)
        console.log(apiRes)
    })
}
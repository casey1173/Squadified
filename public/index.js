const currToken = fetch("https://www.squadified.com/token")

const spotifyAPI = axios.create({
    baseURL: "https://api.spotify.com/v1",
    headers: {"Authorization" : "Bearer " + currToken}
})

window.onload = () => {
    const typeField = document.getElementById("type-field")
    const idField = document.getElementById("id-field")
    const result = document.getElementById("result")
    const butt = document.getElementById("request-button")
    butt.addEventListener("click", (e) => {
        const apiRes = spotifyAPI.get({
            url: `/${typeField.value}/${idField.value}`
        })
        result.appendChild(document.createTextNode(apiRes))
    })
}
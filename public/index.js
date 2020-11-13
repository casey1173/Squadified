 currToken = async function(){
     let res = await axios.get("https://www.squadified.com/token")
     return res.data
    }

window.onload = async () => {
    const typeField = document.getElementById("type-field")
    const idField = document.getElementById("id-field")
    const result = document.getElementById("result")
    const butt = document.getElementById("request-button")
    
    butt.addEventListener("click", async (e) => {
        let apiRes = await axios({
            method: "get",
            baseURL: `https://api.spotify.com/v1/${typeField.value}/${idField.value}`,
            headers: { "Authorization": `Bearer ${await currToken()}` }
        })
        console.log(apiRes)
    })
}
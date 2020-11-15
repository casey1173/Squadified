
window.onload = async () => {
    const typeField = document.getElementById("type-field")
    const idField = document.getElementById("id-field")
    const result = document.getElementById("result")
    const butt = document.getElementById("request-button")

    butt.addEventListener("click", async (e) => {
        let apiRes = getResource(typeField.value + "/" + idField.value)
        console.log(apiRes)
    })
}
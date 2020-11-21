const LINK_TO_USERNAME = "https://www.spotify.com/account/overview/"
let state = {
    user1: {
        "display_name": "Grant Fourie",
        "external_urls": {
            "spotify": "https://open.spotify.com/user/216b2zmcnk3bprifcfvctpfoq"
        },
        "followers": {
            "href": null,
            "total": 12
        },
        "href": "https://api.spotify.com/v1/users/216b2zmcnk3bprifcfvctpfoq",
        "id": "216b2zmcnk3bprifcfvctpfoq",
        "images": [
            {
                "height": null,
                "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1974957916103421&height=300&width=300&ext=1608330443&hash=AeSXHc9TMWmT_fAmI6Q",
                "width": null
            }
        ],
        "type": "user",
        "uri": "spotify:user:216b2zmcnk3bprifcfvctpfoq"
    },
    user2: {
        "display_name": "renreynolds12",
        "external_urls": {
            "spotify": "https://open.spotify.com/user/renreynolds12"
        },
        "followers": {
            "href": null,
            "total": 14
        },
        "href": "https://api.spotify.com/v1/users/renreynolds12",
        "id": "renreynolds12",
        "images": [],
        "type": "user",
        "uri": "spotify:user:renreynolds12"
    },
    user1Playlists: [],
    user2Playlists: [],
    user1Included: [],
    user2Included: [],
    user1Songs: [],
    user2Songs: [],
    user1Results :{},
    user2Results: {}
}

/**
 *
 * @param parent @type {HTMLElement}
 * @returns {Promise<void>}
 */

async function attachModal() {
    const modalScreen = document.createElement("div")
    modalScreen.id = "modal-screen"
    document.body.appendChild(modalScreen)
}

async function renderUserSelector() {
    const modal = document.getElementById("modal-screen")

    const container = document.createElement("div")
    container.id = "user-select-container"
    container.classList.add("animated-entry")

    const heading = document.createElement("h1")
    heading.classList.add("section-heading")
    heading.appendChild(document.createTextNode("Add two Spotify users"))
    container.appendChild(heading)

    const usernameLink = document.createElement("div")
    const explanationText = document.createElement("p")
    explanationText.appendChild(document.createTextNode("Find your username here"))
    explanationText.classList.add("info-text")
    const linkBox = document.createElement("a")
    linkBox.classList.add("link-box")
    linkBox.href = LINK_TO_USERNAME
    linkBox.target = "_blank"
    linkBox.appendChild(document.createTextNode("https://www.spotify.com/account/overview/"))
    usernameLink.appendChild(explanationText)
    usernameLink.appendChild(linkBox)

    container.appendChild(usernameLink)

    const inputBox = document.createElement("div")
    inputBox.classList.add("user-input-box")
    for (let i = 1; i < 3; i++) {
        const userContainer = document.createElement("div")
        userContainer.classList.add("input-container")

        const searchField = document.createElement("input")
        searchField.classList.add("user-search-field")
        searchField.id = "user-search-field-" + i


        const getButt = document.createElement("button")
        getButt.id = "get-user-button-" + i
        getButt.classList.add("get-user-butt")
        getButt.appendChild(document.createTextNode("Get User " + i))
        getButt.addEventListener("click", async (e) => {
            state["user" + i] = await renderUserProfile(searchField.value, e.target.parentNode)

        })


        const label = document.createElement("label")
        label.appendChild(document.createTextNode(`Enter ${i == 1 ? "1st" : "2nd"} username:`))
        label.classList.add("user-search-label")
        label.for = "get-user-button-" + i

        userContainer.appendChild(label)
        userContainer.appendChild(searchField)
        userContainer.appendChild(getButt)

        inputBox.appendChild(userContainer)
    }

    container.appendChild(inputBox)

    while (modal.firstChild) {
        modal.firstChild.remove()
    }
    modal.appendChild(container)

    const nextButton = document.createElement("button")
    nextButton.classList.add("next-button", "animated-entry")
    nextButton.id = "next-button"
    const nButtonText = document.createElement("h1")
    nButtonText.classList.add("section-heading")
    nButtonText.appendChild(document.createTextNode("Next >"))
    nextButton.appendChild(nButtonText)
    nextButton.addEventListener("click", async (e) => {
        if (Object.entries(state.user1).length > 0 && Object.entries(state.user2).length > 0) {
            container.classList.replace("animated-entry", "animated-exit")
            nextButton.classList.replace("animated-entry", "animated-exit")
            state.user1Playlists = getPlaylists(state.user1.id)
            state.user2Playlists = getPlaylists(state.user2.id)
        }
    })

    modal.appendChild(nextButton)
}

async function renderPlaylistIncluder() {
    const modal = document.getElementById("modal-screen")
    const container = document.createElement("div")
    container.id = "playlist-select-container"
    container.classList.add("animated-entry")

    const heading = document.createElement("h1")
    heading.classList.add("section-heading")
    heading.appendChild(document.createTextNode("Choose some playlists to represent each user"))
    container.appendChild(heading)

    const inputBox = document.createElement("div")
    inputBox.classList.add("user-input-box")
    container.appendChild(inputBox)
    for (let i = 1; i < 3; i++) {
        const inputContainer = document.createElement("div")
        inputContainer.classList.add("input-container")

        const searchField = document.createElement("textarea")
        searchField.id = "pl-search-" + i
        searchField.classList.add("user-search-field")
        searchField.placeholder = `include up to 3 of ${i == 1 ? state.user1.display_name : state.user2.display_name}'s playlists...`
        searchField.maxLength = 100
        searchField.addEventListener("input", (e) => {
            inputContainer.querySelectorAll(".playlist-list").forEach(e => e.remove())
            renderMatchingPlaylists(e.target)
        })


        inputContainer.appendChild(searchField)

        const includedPlaylists = document.createElement("div")
        includedPlaylists.classList.add("playlist-list")
        includedPlaylists.style.justifySelf = "flex-end"
        includedPlaylists.id = "included-playlists-" + i
        inputBox.appendChild(inputContainer)
    }
    const resultsButton = document.createElement("button")
    resultsButton.classList.add("next-button", "animated-entry")
    resultsButton.id = "results-button"
    const rButtonText = document.createElement("h1")
    rButtonText.classList.add("section-heading")
    rButtonText.appendChild(document.createTextNode("Results >"))
    resultsButton.appendChild(rButtonText)
    resultsButton.addEventListener("click", (e) => {
        if (state.user1Included.length > 0 && state.user2Included.length > 0) {
            container.classList.replace("animated-entry", "animated-exit")
            resultsButton.classList.replace("animated-entry", "animated-exit")
            modal.classList.add("become-black")
        }

    })

    modal.appendChild(container)
    modal.appendChild(resultsButton)
}

async function renderMatchingPlaylists(textArea) {

    textArea.parentNode.querySelectorAll(".playlist-list, .included-list").forEach(e => e.remove())

    const parent = textArea.parentNode
    const user = textArea.id.split("-")[2]
    let searchTerm = textArea.value
    searchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const included = state["user" + user + "Included"]
    const regexp = new RegExp(searchTerm, "i")

    const matchList = document.createElement("div")
    const playlists = user == 1 ? await state.user1Playlists : await state.user2Playlists
    let matches = playlists.filter(pl => regexp.test(pl.name) && !included.includes(pl))
    if (matches.length > 3) {
        matches = matches.splice(0, 3)
    }
    if (textArea.value.length == 0) {
        matches = []
    }

    matches.push(...included)

    matchList.classList.add("playlist-list")
    matchList.id = "match-list-" + textArea.id.split("-")[2]

    matches.forEach((pl) => {
        renderPlaylistItem(pl, matchList)
    })
    parent.appendChild(matchList)

}

async function renderPlaylistItem(playlist, parent) {

    const user = parent.id.split("-")[2]
    const included = state["user" + user + "Included"]
    const checked = included.includes(playlist)

    const listItem = document.createElement("div")
    listItem.classList.add("list-item")
    listItem.style.borderColor = checked ? "var(--spotify-green)" : "white"
    listItem.style.borderWidth = checked ? "4px" : "2px"
    listItem.appendChild(document.createTextNode(playlist.name))
    const addPLButton = document.createElement("div")
    addPLButton.classList.add("add-pl-butt")

    addPLButton.addEventListener("click", (e) => {
        if (checked) {
            included.splice(included.indexOf(playlist), 1)
        } else if (included.length == 3) {
            return
        } else {
            included.push(playlist)
        }
        listItem.parentNode.remove()
        renderMatchingPlaylists(document.getElementById("pl-search-" + user))
        document.getElementById("pl-search-" + user).focus()
    })
    if (!checked && included.length == 3) {
        addPLButton.style.cursor = "not-allowed"
    }
    const checkboxIcon = document.createElement("img")
    checkboxIcon.src = checked ? "./checkbox.png" : "./empty-checkbox.png"
    addPLButton.appendChild(checkboxIcon)
    listItem.appendChild(addPLButton)
    parent.appendChild(listItem)
}

/**
 *
 * @param username @type {string}
 * @param parent @type {HTMLElement}
 * @returns {Promise<void>}
 */
async function renderUserProfile(username, parent) {
    const previous = parent.getElementsByClassName("user-profile")[0]
    if (previous) {
        previous.remove()
    }
    let userObject = {}
    try {
        userObject = await getUser(username)

    } catch (e) {
        return {}
        console.log(e)
    }

    const userProfile = document.createElement("div")
    window.requestAnimationFrame(() => {
        return
    })
    userProfile.classList.add("user-profile", "fade-entry")

    const userAvi = document.createElement("img")
    userAvi.classList.add("user-avi")
    userAvi.id = "user-avi-" + username
    userAvi.src = userObject.images.length > 0 ? userObject.images[0].url : "./user-icon.png"


    const name = document.createElement("span")
    name.classList.add("section-heading")
    name.appendChild(document.createTextNode(userObject.display_name))

    userProfile.appendChild(userAvi)
    userProfile.appendChild(name)

    parent.appendChild(userProfile)
    userProfile.id = "user-profile-" + username

    return userObject
}


async function renderResults(){
    const modal = document.getElementById("modal-screen")
    const loadingLP = document.createElement("img")
    loadingLP.classList.add("animated-entry", "loading-lp")
    loadingLP.src = "./loading-LP.PNG"
    modal.appendChild(loadingLP)
    console.log(state)

    const user1AvgFeatures = getAvgFeatures(await getSongFeatures( await getSongs(state.user1Included)))
    console.log(user1AvgFeatures)

}

async function getAvgFeatures(featuresArray){
    const numSongs = featuresArray.length
    let avgFeatures = {
        danceability: 0,
        energy: 0,
        acousticness: 0,
        loudness: 0,
        valence: 0,
        tempo: 0,
    }
    for (const f in featuresArray){
        for (const k in Object.keys(avgFeatures)){
            avgFeatures.k += f.k
        }
    }
    for (const k in Object.keys(avgFeatures)){
        avgFeatures.k = avgFeatures.k / numSongs
    }
    return avgFeatures
}

window.onload = async function(){
    attachModal()
    //renderUserSelector()
    state.user1Playlists = getPlaylists("216b2zmcnk3bprifcfvctpfoq")
    state.user2Playlists = getPlaylists("renreynolds12")
    renderPlaylistIncluder()

}

window.addEventListener("click", (e) => {
    if (e.target == document.getElementById("modal-screen")
        && state.user1ID && state.user2ID) {
        //document.getElementById("modal-screen").style.display = "none"
    }
})

window.addEventListener("animationend", (e) => {

    if (e.animationName == "slide-out" || e.animationName == "fade-out") {

        document.querySelectorAll(".animated-exit, .fade-exit").forEach((e) => {
            e.remove()
        })
    }
    if (e.path[0].id == "user-select-container" && e.animationName == "slide-out") {
        renderPlaylistIncluder()
    }
    if (e.path[0].id == "playlist-select-container" && e.animationName == "slide-out") {
        renderResults()
    }
    if(e.path[0].classList.contains("loading-lp") && e.animationName == "slide-in"){
        document.getElementsByClassName("loading-lp")[0].classList.replace("animated-entry", "spin-on-load")
    }
})

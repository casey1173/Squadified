# Squadified

Squadified is a website that'll generate song recommendations for you and a friend to share based on a playlist from each.

# How to use the app

Go to squadified.com. Type in two Spotify usernames to choose playlists from. Hit Next and you'll be able to search the playlists of both users and select one each.
Finally, hit results and we'll show analytics for how the two playlists compare across various audio features. At the bottom is a list of song recommendations generated using song data from both playlists. Click on any of the spinning song records to open and play it in Spotify.

# Features

- Quick spotify user selection
- Dynamic playlist searching
- Acoustic analysis of playlists
- Joint song recommendations

# Backend
The app functions through api calls to our server and Spotify. API requests for the audio features of songs are filtered through the server database. This reduces API calls to Spotify. Any unrecognized songs are requested from Spotify and logged to the database for future reference. The full song database can be viewed at squadified.com/allsongs.



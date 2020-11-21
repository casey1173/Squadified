const playlist_data = require('data-store')({ path: process.cwd() + '/data/song.json' });
class Playlist {

    constructor (user, songs) {
        this.user = user;   //user associated w playlist
        this.songs = songs; //array of Song objects
    }

    update () {
        song_data.set(this.id.toString(), this);
    }

    delete () {
        song_data.del(this.id.toString());
    }
}

module.exports = Playlist;
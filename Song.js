const song_data = require('data-store')({ path: process.cwd() + '/data/song.json' });
class Song {

    constructor (sid) {
        this.sid = sid; //	The Spotify ID for the track.
        //this.name = name; //name of song
        //this.artist = artist; //song's artist
        this.features = {};
        
    }

    addFeature (features) {
        this.features = features;
        this.update()
    }

    update () {
        song_data.set(this.sid, this);
    }

    delete () {
        song_data.del(this.sid);
    }
}


Song.addFeatures = (sid, features) => {
    let count = 0;
    //console.log("\tadding features to songs")
    sid.forEach(function(sid) {
        let s = song_data.get(sid)
        s.addFeature(features[count])
        count = count+1
    })
    song_data.save();
}

Song.getSongs = () => {
    return song_data.data;
}

Song.create = (sid) => {
    let s = new Song(id)
    song_data.set(s.sid, s);
    return s;
}

Song.createSongs = (songs) => {
    //console.log("\tcreating new songs in db")
    songs.forEach(function(sid) {
        let song = new Song(sid)
        song_data.set(sid, song);
    })
}

Song.findByID = (sid) => {
    let sData = song_data.get(sid);
    if (sData != null) {
        return sData;
    }
    return null;
}

module.exports = Song;
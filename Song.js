const song_data = require('data-store')({ path: process.cwd() + '/data/song.json' });
class Song {

    constructor (sid) {
        this.sid = sid; //	The Spotify ID for the track.
        //this.uri = uri; // The Spotify URI for the track
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

/*
Song.addFeatures = (sid, duration, key, mode, acousticness, danceability, energy, instrumentalness, liveness, loudness, speechiness, valence, tempo) => {
        this.duration = duration; //length of song in ms
        this.key = key; //estimated overall key of the track
        this.mode = mode; //major or minor (1 or 0)
        this.acousticness = acousticness; //A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.
        this.danceability = danceability; //Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable. 
        this.energy = energy; //Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity.
        this.instrumentalness = instrumentalness; //Predicts whether a track contains no vocals. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0. 
        this.liveness = liveness; //Detects the presence of an audience in the recording
        this.loudness = loudness; //The overall loudness of a track in decibels
        this.speechiness = speechiness; //	Speechiness detects the presence of spoken words in a track.
        this.valence = valence; //A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track
        this.tempo = tempo; //The overall estimated tempo of a track in beats per minute (BPM)
}
*/
Song.addFeatures = (sid, features) => {
    let count = 0;
    console.log("adding features to songs")
    sid.forEach(function(sid) {
        let s = song_data.get(sid)
        s.addFeature(features[count])
        count = count+1
    })
    /*
    this.duration = features[0]; //length of song in ms
    this.key = features[1]; //estimated overall key of the track
    this.mode = features[2]; //major or minor (1 or 0)
    this.acousticness = features[3]; //A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.
    this.danceability = features[4]; //Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable. 
    this.energy = features[5]; //Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity.
    this.instrumentalness = features[6]; //Predicts whether a track contains no vocals. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0. 
    this.liveness = features[7]; //Detects the presence of an audience in the recording
    this.loudness = features[8]; //The overall loudness of a track in decibels
    this.speechiness = features[9]; //	Speechiness detects the presence of spoken words in a track.
    this.valence = features[10]; //A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track
    this.tempo = features[11]; //The overall estimated tempo of a track in beats per minute (BPM)
    */
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
    console.log("creating new songs in db")
    songs.forEach(function(sid) {
        let song = new Song(sid)
        song_data.set(sid, song);
    })
    //return song;
}

Song.findByID = (sid) => {
    //console.log("trying to get songs from db")
    let sData = song_data.get(sid);
    if (sData != null) {
        //console.log(sData);
        //return new Song();
        return sData;
    }
    return null;
}

module.exports = Song;
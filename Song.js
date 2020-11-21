const song_data = require('data-store')({ path: process.cwd() + '/data/song.json' });
class Song {

    constructor (sid, name, artist) {
        this.sid = sid; //	The Spotify ID for the track.
        //this.uri = uri; // The Spotify URI for the track
        this.name = name; //name of song
        this.artist = artist; //song's artist
        
    }

    update () {
        song_data.set(this.id.toString(), this);
    }

    delete () {
        song_data.del(this.id.toString());
    }
}


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


Song.create = (sid, name) => {
    let s = new Song(id, name)
    song_data.set(s.sid, s);
    return s;
}

module.exports = Song;
const mongoose = require('mongoose');

const {Schema} = mongoose;

const AlbumSchema = new Schema({
  name: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  released: { type: Date },
  cover: { type: String },
  genre: [
    { type: Schema.Types.ObjectId, ref: 'Genre'}
  ],
  ISBN: { type: String },
  label: { type: Schema.Types.ObjectId, ref: 'Label' },
  tracklist: { type: String } 
});

const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;

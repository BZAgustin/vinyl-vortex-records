const mongoose = require('mongoose');

const {Schema} = mongoose;

const AlbumSchema = new Schema({
  title: { type: String, 
          required: true, 
          minlength: 1,
          maxlength: 100
        },
  artist: { type: Schema.Types.ObjectId, ref: 'Band', required: true },
  releaseDate: { type: Date, required: true },
  cover: { type: String },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  label: { type: Schema.Types.ObjectId, ref: 'Label' },
  tracklist: [{ type: String }]
});

const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;
const mongoose = require('mongoose');
const { format } = require('date-fns');

const {Schema} = mongoose;

const AlbumSchema = new Schema({
  title: { type: String, 
          required: true, 
          minlength: 1,
          maxlength: 100
        },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  releaseDate: { type: Date, required: true },
  cover: { type: String, minLength: 5, maxLength: 2000 },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  label: { type: String, minLength: 1, maxLength: 80 }
});

AlbumSchema.virtual('url').get(function() {
  return `/catalog/album/${this._id}`;
});

AlbumSchema.virtual('releaseDateString').get(function() {
  return format(this.releaseDate, 'dd/MM/yy');
});

const Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;
const mongoose = require('mongoose');

const {Schema} = mongoose;

const ArtistSchema = new Schema({
  stageName: { type: String, 
               required: true, 
               minlength: 2, 
               maxlength: 60 
            },
  imageUrl: { type: String }
});

ArtistSchema.virtual('url').get(function() {
  return `/catalog/artist/${this._id}`;
});

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
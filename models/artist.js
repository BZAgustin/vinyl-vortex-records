const mongoose = require('mongoose');

const {Schema} = mongoose;

const ArtistSchema = new Schema({
  stageName: { type: String, 
               required: true, 
               minlength: 2, 
               maxlength: 60 
            },
  birthName: { type: String },
  birthDate: { type: Date },
  deathDate: { type: Date },
});

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
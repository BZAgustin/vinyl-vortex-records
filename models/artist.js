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

ArtistSchema.virtual('url').get(function() {
  return `/catalog/artist/${this._id}`;
});

ArtistSchema.virtual('lifespan').get(function() {
  if(this.birthDate && this.deathDate) {
    return `${DateTime.fromJSDate(this.birthDate).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromJSDate(this.deathDate).toLocaleString(DateTime.DATE_MED)}`
  }
  
  if(this.birthDate) {
    return `${DateTime.fromJSDate(this.birthDate).toLocaleString(DateTime.DATE_MED)}`
  }
  
  return `No info`
});

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist;
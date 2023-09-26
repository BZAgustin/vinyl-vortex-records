const mongoose = require('mongoose');

const {Schema} = mongoose;

const GenreSchema = new Schema({
  name: { type: String, 
          required: true,
          minlength: 2,
          maxlength: 60
      }
});

const Genre = mongoose.model('Genre', GenreSchema);

module.exports = Genre;
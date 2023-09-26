const mongoose = require('mongoose');

const { Schema } = mongoose;

const albumInstanceSchema = new Schema({
  album: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
  condition: { type: String, enum: ['New', 'Used'], required: true },
  price: { type: Number },
});

const AlbumInstance = mongoose.model('AlbumInstance', albumInstanceSchema);

module.exports = AlbumInstance;
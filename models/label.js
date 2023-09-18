const mongoose = require('mongoose');

const {Schema} = mongoose;

const LabelSchema = new Schema({
  name: { type: String, required: true },
  contributors: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
  founded: { type: Date },
});

const Label = mongoose.model('Label', LabelSchema);

module.exports = Label;
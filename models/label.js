const mongoose = require('mongoose');

const {Schema} = mongoose;

const LabelSchema = new Schema({
  name: { type: String, required: true },
  contributors: [{ type: String }],
  established: { type: Date },
});

const Label = mongoose.model('Label', LabelSchema);

module.exports = Label;
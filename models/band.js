const mongoose = require('mongoose');

const {Schema} = mongoose;

const BandSchema = new Schema({
  stageName: { type: String, 
               required: true, 
               minlength: 2, 
               maxlength: 60 
            },
  members: [{ type: Schema.Types.ObjectId, ref: 'Artist' }]
});

const Band = mongoose.model('Band', BandSchema);

module.exports = Band;
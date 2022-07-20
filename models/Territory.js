const mongoose = require('mongoose');

//we will need a schema
const territorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  xBox: {
    type: Number,
    required: true
  },
  yBox: {
    type: Number,
    required: true
  },
  color: {
    type: String
  },
  quantity: {
    type: Number
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  pathData: {
    type: String
  }
},{
  timestamps: true
})

//this model allows us to interact with the database
module.exports = mongoose.model('Territory', territorySchema);

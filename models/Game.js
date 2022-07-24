const mongoose = require('mongoose');

//we will need a schema
const gameSchema = new mongoose.Schema({
  gameOrder: {
    type: Array
  },
  turn: {
    type: String
  }
})

//this model allows us to interact with the database
module.exports = mongoose.model('Game', gameSchema);

const mongoose = require('mongoose');

//we will need a schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
})

//this model allows us to interact with the database
module.exports = mongoose.model('User', userSchema);

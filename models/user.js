
const mongoose = require('mongoose');

// USER SCHEMA / MODEL CONFIG
var userSchema = new mongoose.Schema({
  email: String,
  name: String,
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }
  ]
});
module.exports = mongoose.model('User', userSchema);

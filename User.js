const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({   //new user schema
  email: {
    type: String,                       //email must be string
    required: true,                     //must be entered(enforced)
    unique: true
  },
  password: {
    type: String,                       //password must be string
    required: true                      //cannot be left blank 
  }
});
module.exports = mongoose.model("User", userSchema);
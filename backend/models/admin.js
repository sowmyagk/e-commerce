const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,

  role:{
  type:String,
  defaut:"user"
  }

})
const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  email: String,   

  name: String,
  price: Number,
  brand: String,
  image: String,
  quantity: Number
});

module.exports = mongoose.model("Cart", cartSchema);




//const mongoose = require("mongoose");

//const cartSchema = new mongoose.Schema({
 // userId: String, 
//  name: String,
//  price: Number,
//  brand: String,
  //image: String,
 // quantity: Number
//});

//module.exports = mongoose.model("Cart", cartSchema);


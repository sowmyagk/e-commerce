const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String, 
  name: String,
  price: Number,
  brand: String,
  image: String,
  quantity: Number
});

module.exports = mongoose.model("Cart", cartSchema);
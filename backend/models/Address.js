
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  pincode: String,
  city: String,
  addressLine: String
});

module.exports = mongoose.model("Address", addressSchema);
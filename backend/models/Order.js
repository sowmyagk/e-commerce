const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: String,   // ✅ FIXED

  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      brand: String
    }
  ],

  totalAmount: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: String,

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

  // ✅ ADD THIS (VERY IMPORTANT)
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Out for Delivery"],
    default: "Pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
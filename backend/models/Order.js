const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  email: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

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

  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Out for delivery"],
    default: "Pending"
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Card", "UPI"]
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
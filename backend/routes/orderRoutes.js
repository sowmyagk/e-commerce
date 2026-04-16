const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/cart");


router.post("/", async (req, res) => {
  try {
    const cartItems = await Cart.find();

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

   
    const totalAmount = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const newOrder = new Order({
      items: cartItems,
      totalAmount
    });

    await newOrder.save();

   
    await Cart.deleteMany();

    res.json({ message: "Order placed successfully", order: newOrder });

  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;





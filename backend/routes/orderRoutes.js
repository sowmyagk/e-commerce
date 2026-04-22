const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/cart");

/* ✅ CREATE ORDER */
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // ✅ Get only this user's cart
    const cartItems = await Cart.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Calculate total
    const totalAmount = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // ✅ Save order with userId
    const newOrder = new Order({
      userId,
      items: cartItems,
      totalAmount
    });

    await newOrder.save();

    // ✅ Clear only this user's cart
    await Cart.deleteMany({ userId });

    res.json({ message: "Order placed successfully", order: newOrder });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ✅ GET ORDERS BY USER */
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });

    res.json(orders);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
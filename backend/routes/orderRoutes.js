const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/cart");


router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // ✅ USE ITEMS FROM FRONTEND
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount
    });

    await newOrder.save();

    // ✅ clear cart AFTER saving
    await Cart.deleteMany({ userId });

    res.json({ message: "Order placed successfully", order: newOrder });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ✅ GET ALL ORDERS (TEMP FIX) */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
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
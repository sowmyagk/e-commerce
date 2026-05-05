const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/cart");

// ✅ PLACE ORDER
router.post("/", async (req, res) => {
  try {
    const { email, items, totalAmount } = req.body;

    // 🔒 VALIDATIONS
    if (!email) {
      return res.status(400).json({ message: "User email required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    if (!totalAmount) {
      return res.status(400).json({ message: "Total amount required" });
    }

    const newOrder = new Order({
      email,          // ✅ FIXED
      items,
      totalAmount
    });

    await newOrder.save();

    // ✅ CLEAR CART
    await Cart.deleteMany({ email });  // ✅ FIXED

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (err) {
    console.error("Order error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


// ✅ GET ORDERS BY USER
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "User email required" });
    }

    const orders = await Order.find({ email }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch all orders error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
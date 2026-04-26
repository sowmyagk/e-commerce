const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/cart");

// ✅ PLACE ORDER
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    // 🔒 VALIDATIONS
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    if (!totalAmount) {
      return res.status(400).json({ message: "Total amount required" });
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount
    });

    await newOrder.save();

    // ✅ CLEAR CART
    await Cart.deleteMany({ userId });

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


// ✅ GET ORDERS BY USER (IMPORTANT - KEEP ABOVE "/")
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ GET ALL ORDERS (KEEP LAST)
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
const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const User = require("../models/User");

/* =========================
   📊 SALES (Monthly)
========================= */
router.get("/sales", async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   📦 TOTAL ORDERS COUNT
========================= */
router.get("/orders-count", async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   👤 TOTAL USERS COUNT
========================= */
router.get("/users-count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   💰 TOTAL PAYMENTS
========================= */
router.get("/payments", async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({ total: result[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   🚚 ORDER STATUS (Pie Chart)
========================= */
router.get("/order-status", async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");

// Sales (group by date/month/year)
router.get("/sales", async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      }
    ]);

    res.json(sales);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Total orders
router.get("/orders-count", async (req, res) => {
  const count = await Order.countDocuments();
  res.json({ count });
});

// Signup count
router.get("/users-count", async (req, res) => {
  const count = await User.countDocuments();
  res.json({ count });
});

// Payments received
router.get("/payments", async (req, res) => {
  const payments = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" }
      }
    }
  ]);
  res.json(payments[0]);
});

module.exports = router;

const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/cart");


// ============================
// PLACE ORDER
// ============================

router.post("/", async (req, res) => {

  try {

    const {
      email,
      items,
      totalAmount
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email required"
      });
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No items provided"
      });
    }

    if (!totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Total amount required"
      });
    }

    const newOrder = new Order({
      email,
      items,
      totalAmount,
      status: "Pending"
    });

    await newOrder.save();

    await Cart.deleteMany({ email });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (err) {

    console.error("Order error:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ============================
// GET ALL ORDERS
// ============================

router.get("/", async (req, res) => {

  try {

    const orders = await Order.find()
      .sort({
        createdAt: -1
      });

    res.json(orders);

  } catch (err) {

    console.error("Fetch all orders error:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ============================
// DASHBOARD STATS
// ============================

router.get("/dashboard/stats", async (req, res) => {

  try {

    const totalOrders =
      await Order.countDocuments();

    const revenueData =
      await Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount"
            }
          }
        }
      ]);

    const delivered =
      await Order.countDocuments({
        status: "Delivered"
      });

    const pending =
      await Order.countDocuments({
        status: "Pending"
      });

    const shipped =
      await Order.countDocuments({
        status: "Shipped"
      });

    const outForDelivery =
      await Order.countDocuments({
        status: "Out for delivery"
      });

    res.json({
      success: true,
      totalOrders,

      totalRevenue:
        revenueData.length > 0
          ? revenueData[0].totalRevenue
          : 0,

      delivered,
      pending,
      shipped,
      outForDelivery
    });

  } catch (err) {

    console.error(
      "Dashboard stats error:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ============================
// UPDATE STATUS
// ============================

router.put("/update-status/:id", async (req, res) => {

  try {

    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Shipped",
      "Delivered",
      "Out for delivery"
    ];

    if (!validStatuses.includes(status)) {

      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    res.json({
      success: true,
      message: "Status updated successfully",
      order: updatedOrder
    });

  } catch (err) {

    console.error("Update status error:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ============================
// GET USER ORDERS
// ============================

router.get("/:email", async (req, res) => {

  try {

    const { email } = req.params;

    const orders = await Order.find({
      email
    }).sort({
      createdAt: -1
    });

    res.json(orders);

  } catch (err) {

    console.error(
      "Fetch user orders error:",
      err
    );

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
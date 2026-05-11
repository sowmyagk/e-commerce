const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");


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

      {
        $sort: { _id: 1 }
      }

    ]);

    res.json(sales);

  }

  catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});

router.get("/order-status", async (req, res) => {

  try {


    const orders = await Order.find();

    const products = await Product.find();

    const users = await User.find();

    
    const totalOrders = orders.length;

    const totalProducts = products.length;

    const totalUsers = users.length;
    
    console.log(totalOrders);
    

    let delivered = 0;

    let pending = 0;

    let shipped = 0;

    let outForDelivery = 0;

    let processing = 0;

    let totalRevenue = 0;

    orders.forEach((order) => {

      totalRevenue += Number(order.totalAmount || 0);

      if (order.status === "Delivered") {

        delivered++;

      }

      else if (order.status === "Pending") {

        pending++;

      }

      else if (order.status === "Shipped") {

        shipped++;

      }

      else if (order.status === "Out for delivery") {

        outForDelivery++;

      }

      else if (order.status === "Processing") {

        processing++;

      }

    });

    console.log({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      delivered,
      pending,
      shipped,
      outForDelivery,
      processing
    });


    res.json({

      success: true,

      totalOrders,

      totalProducts,

      totalUsers,

      totalRevenue,

      delivered,

      pending,

      shipped,

      outForDelivery,

      processing

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message
    });

  }

});

module.exports = router;
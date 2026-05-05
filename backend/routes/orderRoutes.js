const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/cart");

// ✅ ADD THESE 2 LINES
const generateInvoice = require("../utils/generateInvoice");
const sendEmail = require("../utils/sendEmail");


// ✅ PLACE ORDER
router.post("/", async (req, res) => {
  try {
    const { email, items, totalAmount } = req.body;

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
      email,
      items,
      totalAmount
    });

    await newOrder.save();

    // ✅ CLEAR CART
    await Cart.deleteMany({ email });

    // 🔥🔥🔥 IMPORTANT PART STARTS HERE

    try {
      const pdfBuffer = await generateInvoice(newOrder);

      await sendEmail(
        email,
        null,        // no OTP
        pdfBuffer    // 🔥 send invoice
      );

      console.log("✅ Invoice email sent");
    } catch (err) {
      console.log("❌ Invoice email failed:", err.message);
    }

    // 🔥🔥🔥 IMPORTANT PART ENDS HERE

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

module.exports = router;
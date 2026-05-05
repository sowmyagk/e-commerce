const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const generateInvoice = require("../utils/generateInvoice");
const { sendInvoiceEmail } = require("../utils/sendEmail");
const Order = require("../models/Order");

// ============================================
// ✅ CREATE CHECKOUT SESSION
// ============================================
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { orderId, totalAmount } = req.body;

    if (!orderId || !totalAmount) {
      return res.status(400).json({ error: "Order ID & amount required" });
    }

    // 🔥 Fetch order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      // ✅ attach email
      customer_email: order.email,

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Order Payment",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],

      metadata: {
        orderId: orderId,
      },

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.log("❌ Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});


// ============================================
// ✅ STRIPE WEBHOOK (MAIN FIX)
// ============================================
router.post("/webhook", async (req, res) => {
  console.log("🔥 WEBHOOK HIT");

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("❌ Signature verification failed:", err.message);
    return res.sendStatus(400);
  }

  console.log("✅ Event type:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      console.log("💰 PAYMENT SUCCESS EVENT RECEIVED");

      const session = event.data.object;

      const orderId = session.metadata?.orderId;
      console.log("📦 Order ID:", orderId);

      if (!orderId) return res.sendStatus(200);

      const order = await Order.findById(orderId);

      if (!order) {
        console.log("❌ Order not found");
        return res.sendStatus(200);
      }

      console.log("📧 Sending invoice to:", order.email);

      // ✅ Generate invoice (BUFFER)
      const pdfBuffer = await generateInvoice(order);

      // ✅ Send email
      await sendInvoiceEmail(order.email, pdfBuffer);

      console.log("📩 Invoice sent successfully!");
    }

    res.sendStatus(200);

  } catch (err) {
    console.log("❌ Webhook Error:", err.message);
    res.sendStatus(400);
  }
});

module.exports = router;
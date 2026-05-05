const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Import your utils (make sure these files exist)
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Order Payment",
            },
            unit_amount: totalAmount * 100, // ✅ convert to paise
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      // ✅ IMPORTANT → used in webhook
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
// ✅ STRIPE WEBHOOK (PAYMENT SUCCESS)
// ============================================
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const event = req.body;

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const orderId = session.metadata?.orderId;

        console.log("✅ Payment successful for order:", orderId);

        if (!orderId) {
          console.log("❌ No orderId found in metadata");
          return res.sendStatus(200);
        }

        // ✅ Get order from DB
        const order = await Order.findById(orderId);

        if (!order) {
          console.log("❌ Order not found");
          return res.sendStatus(200);
        }

        // ✅ Generate invoice PDF
        const filePath = await generateInvoice(order);

        // ✅ Send email with invoice
        const pdfBuffer = await generateInvoice(order);
          await sendInvoiceEmail(order.email, pdfBuffer);

        console.log("📩 Invoice sent successfully!");
      }

      res.sendStatus(200);

    } catch (err) {
      console.log("❌ Webhook Error:", err.message);
      res.sendStatus(400);
    }
  }
);

module.exports = router;
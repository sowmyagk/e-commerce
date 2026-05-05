const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const { orderId } = req.body; // ✅ IMPORTANT

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
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
            unit_amount: 50000, // You can replace with dynamic amount later
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      // ✅ FIX HERE (VERY IMPORTANT)
      success_url: `${process.env.CLIENT_URL}/success?orderId=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.log("❌ Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
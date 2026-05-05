require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// ROUTES
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const stripeRoutes = require("./routes/stripe");

// UTILS
const { sendOTPEmail, sendInvoiceEmail } = require("./utils/sendEmail");
const generateInvoice = require("./utils/generateInvoice");

// MODELS
const User = require("./models/User");
const Order = require("./models/Order");

const app = express();


// ☁️ CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ============================================
// 🔥 IMPORTANT MIDDLEWARE ORDER (FIXED)
// ============================================

// ✅ Stripe webhook needs RAW body (ONLY for this route)
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" })
);

// ✅ Normal middleware
app.use(express.json());
app.use(cors());


// 🟢 MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));


// 🛣️ ROUTES
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);


// ROOT
app.get("/", (req, res) => {
  res.send("API is running...");
});


// =========================
// 🔢 OTP STORE (TEMP MEMORY)
// =========================
let otpStore = {};


// =========================
// 📩 SEND OTP
// =========================
app.post("/api/otp/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (otpStore[email] && otpStore[email].expires > Date.now()) {
      console.log("⚠️ Using existing OTP:", otpStore[email].otp);
      return res.json({
        success: true,
        isNewUser: !user
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    };

    console.log("🔢 OTP:", otp, "EMAIL:", email);

    const emailRes = await sendOTPEmail(email, otp);

    if (emailRes?.error) {
      return res.json({
        success: false,
        message: "Failed to send OTP email"
      });
    }

    return res.json({
      success: true,
      isNewUser: !user,
      otp // remove in production
    });

  } catch (err) {
    console.log("❌ SEND OTP ERROR:", err);
    return res.json({ success: false, message: "Server error" });
  }
});


// =========================
// ✅ VERIFY OTP
// =========================
app.post("/api/otp/verify", async (req, res) => {
  try {
    const { email, otp, name, phone } = req.body;

    const record = otpStore[email];

    if (!record) {
      return res.json({ success: false, message: "No OTP found" });
    }

    if (record.expires < Date.now()) {
      delete otpStore[email];
      return res.json({ success: false, message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    let user = await User.findOne({ email });

    if (!user && name && phone) {
      user = new User({ name, email, phone });
      await user.save();
    }

    delete otpStore[email];

    return res.json({ success: true });

  } catch (err) {
    console.log("❌ VERIFY ERROR:", err);
    return res.json({ success: false });
  }
});


// =========================
// 📩 SEND INVOICE (COD)
// =========================
app.post("/api/send-invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (!order.email) {
      return res.json({ success: false, message: "Email missing" });
    }

    console.log("📧 Sending invoice to:", order.email);

    const pdfBuffer = await generateInvoice(order);

    const emailRes = await sendInvoiceEmail(order.email, pdfBuffer);

    if (emailRes?.error) {
      return res.json({
        success: false,
        message: "Email sending failed"
      });
    }

    return res.json({
      success: true,
      message: "Invoice sent successfully"
    });

  } catch (err) {
    console.log("❌ INVOICE ERROR:", err);
    return res.json({
      success: false,
      message: "Server error"
    });
  }
});


// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
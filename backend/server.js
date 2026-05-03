require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const stripeRoutes = require("./routes/stripe");

const sendEmail = require("./utils/sendEmail");
const User = require("./models/User");

const app = express();

// ☁️ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

// 🟢 MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// 🛣️ Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔢 OTP Store
let otpStore = {};

// =========================
// 📩 SEND OTP
// =========================
app.post("/api/otp/send", async (req, res) => {
  const { email } = req.body;

  if (!email || email.length < 5) {
    return res.json({ success: false, message: "Invalid email" });
  }

  const user = await User.findOne({ email });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  };

  console.log("🔢 OTP:", otp, "EMAIL:", email);

  // ✅ ENV DEBUG
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "EXISTS" : "MISSING");

  // 🚀 SEND EMAIL IN BACKGROUND (IMPORTANT FIX)
  sendEmail(email, otp)
    .then(() => {
      console.log("✅ EMAIL SENT SUCCESS");
    })
    .catch((err) => {
      console.log("❌ EMAIL ERROR:", err.message);
    });

  // ✅ ALWAYS RESPOND SUCCESS (like real apps)
  return res.json({
    success: true,
    isNewUser: !user,
    // ⚠️ TEMP: show OTP (for testing/demo)
    otp: otp
  });
});

// =========================
// ✅ VERIFY OTP
// =========================
app.post("/api/otp/verify", async (req, res) => {
  const { email, otp, name, phone } = req.body;

  const record = otpStore[email];

  if (
    record &&
    record.otp === otp &&
    record.expires > Date.now()
  ) {
    try {
      let user = await User.findOne({ email });

      // 🆕 Create user if not exists
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
  }

  return res.json({
    success: false,
    message: "Invalid or expired OTP"
  });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
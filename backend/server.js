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


// ☁️ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// 🔐 Middleware
app.use(cors());
app.use(express.json());


// 🍃 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));


// 📦 Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);


// 🏠 Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// 🔢 OTP Store (temporary)
let otpStore = {};


// 📩 SEND OTP (INSTANT ⚡)
app.post("/api/otp/send", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email required" });
  }

  // Optional validation
  if (!email || email.length < 5) {
    return res.json({ success: false, message: "Invalid email" });
  }


  const user = await User.findOne({ email });

return res.json({
  success: true,
  isNewUser: !user
});

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  try {
    // ⚡ Send email WITHOUT waiting
    try {
  await sendEmail(email, otp);
  console.log("EMAIL SENT SUCCESS");
} catch (err) {
  console.log("EMAIL ERROR FULL:", err.response?.body || err.message);
}

    console.log("✅ OTP SENT:", otp);


    return res.json({
  success: true
});


  } catch (err) {
    console.log("❌ SERVER ERROR:", err);
    return res.json({ success: false });
  }
});


// ✅ VERIFY OTP
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

      // 🆕 Create new user if not exists
      if (!user && name && phone) {
        user = new User({ name, email, phone });
        await user.save();
      }

      // 🧹 Remove OTP after success
      delete otpStore[email];

      return res.json({ success: true });

    } catch (err) {
      console.log("❌ VERIFY ERROR:", err);
      return res.json({ success: false });
    }
  }

  return res.json({ success: false, message: "Invalid or expired OTP" });
});


// 🚀 Server Start
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
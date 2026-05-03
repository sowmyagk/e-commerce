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
  try {
    const { email } = req.body;

    if (!email || email.length < 5) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const user = await User.findOne({ email });

    // ✅ Prevent multiple OTP generation
    if (otpStore[email] && otpStore[email].expires > Date.now()) {
      return res.json({
        success: true,
        isNewUser: !user,
        message: "OTP already sent. Please check your email."
      });
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 mins
    };

    console.log("🔢 OTP:", otp, "EMAIL:", email);

    // 📩 Send email (Resend)
    const emailResponse = await sendEmail(email, otp);

    console.log("📩 Email Response:", emailResponse);

    // ❌ If email failed
    if (emailResponse && emailResponse.error) {
      return res.json({
        success: false,
        message: emailResponse.error.message || "Email failed"
      });
    }

    // ✅ Success
    return res.json({
      success: true,
      isNewUser: !user,
      otp: otp // ⚠️ KEEP for demo, REMOVE in production
    });

  } catch (err) {
    console.log("❌ SEND OTP ERROR:", err);
    return res.json({
      success: false,
      message: "Server error"
    });
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
      return res.json({
        success: false,
        message: "No OTP found. Please request again."
      });
    }

    if (record.expires < Date.now()) {
      delete otpStore[email];
      return res.json({
        success: false,
        message: "OTP expired"
      });
    }

    if (record.otp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // ✅ OTP correct
    let user = await User.findOne({ email });

    if (!user && name && phone) {
      user = new User({ name, email, phone });
      await user.save();
    }

    delete otpStore[email];

    return res.json({ success: true });

  } catch (err) {
    console.log("❌ VERIFY ERROR:", err);
    return res.json({
      success: false,
      message: "Verification failed"
    });
  }
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
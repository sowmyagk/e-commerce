require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const sendEmailOTP = require("./utils/sendEmail");
const User = require("./models/User");

// Routes
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const stripeRoutes = require("./routes/stripe");

const app = express();

// ✅ CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());


// ✅ Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));


// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);


// ✅ Test
app.get("/", (req, res) => {
  res.send("API is running...");
});


// ===============================
// 🔐 AUTH SYSTEM
// ===============================

const otpStore = {};

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);


// ✅ CHECK USER
app.post("/api/user/check", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    res.json({ exists: !!user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ SEND OTP
app.post("/api/otp/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    await sendEmailOTP(email, otp);

    console.log("OTP:", otp); // 🔥 debug

    res.json({
      success: true,
      message: "OTP sent"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "OTP failed"
    });
  }
});


// ✅ VERIFY OTP
app.post("/api/otp/verify", async (req, res) => {
  try {
    const { email, otp, name, phone } = req.body;

    const record = otpStore[email];

    if (!record) {
      return res.json({ success: false, message: "No OTP" });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.json({ success: false, message: "Expired" });
    }

    if (record.otp !== otp) {
      return res.json({ success: false, message: "Wrong OTP" });
    }

    delete otpStore[email];

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, phone });
      await user.save();
      console.log("✅ New user saved");
    }

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
});


// ===============================
// ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false });
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const sendEmailOTP = require("./utils/sendEmail");

// ✅ NEW: USER MODEL
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
  credentials: true
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


// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// ===============================
// 🔐 AUTH SYSTEM STARTS HERE
// ===============================

// ✅ OTP STORE
const otpStore = {};


// ✅ EMAIL VALIDATION
const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};


// ✅ CHECK USER EXISTS (🔥 IMPORTANT)
app.post("/api/user/check", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const user = await User.findOne({ email });

    res.json({ exists: !!user });

  } catch (err) {
    console.log("CHECK USER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ SEND OTP
app.post("/api/otp/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    await sendEmailOTP(email, otp);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (err) {
    console.log("OTP SEND ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
});


// ✅ VERIFY OTP + SAVE USER (🔥 MOST IMPORTANT FIX)
app.post("/api/otp/verify", async (req, res) => {
  try {
    const { email, otp, name, phone } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required"
      });
    }

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found"
      });
    }

    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    delete otpStore[email];

    // ✅ SAVE USER IF NEW
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        phone
      });

      await user.save();
      console.log("✅ New user saved");
    } else {
      console.log("✅ Existing user login");
    }

    res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// ===============================
// 🔐 AUTH SYSTEM ENDS HERE
// ===============================


// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
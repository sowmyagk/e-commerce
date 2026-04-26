require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const sendEmailOTP = require("./utils/sendEmail");

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


// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// ✅ OTP STORE (with expiry)
const otpStore = {};


// ✅ SEND OTP (EMAIL)
app.post("/api/otp/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 min
    };

    // 🔥 SEND EMAIL HERE
    await sendEmailOTP(email, otp);

    res.json({ success: true, message: "OTP sent to email" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});


// ✅ VERIFY OTP
app.post("/api/otp/verify", (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.json({ success: false, message: "OTP not found" });
  }

  const stored = otpStore[email];

  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return res.json({ success: false, message: "OTP expired" });
  }

  if (stored.otp !== otp) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[email];

  res.json({ success: true, message: "OTP verified" });
});


// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
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

const app = express();


// ✅ CORS (FIXED FOR PRODUCTION)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());


// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ✅ MongoDB connection (FIXED ❗ REMOVE OLD OPTIONS)
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


// ✅ OTP STORAGE (IMPROVED)
const otpStore = {}; // store multiple users


// ✅ Send OTP
app.post("/OTP", (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.json({ success: false, message: "Value required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[value] = otp;

  res.json({ success: true, otp });
});


// ✅ Register + OTP
app.post("/register", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.json({ success: false, message: "All fields required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  res.json({ success: true, otp });
});


// ✅ Verify OTP
app.post("/verify-otp", (req, res) => {
  const { value, otp } = req.body;

  if (otpStore[value] === otp) {
    delete otpStore[value];
    return res.json({ success: true });
  }

  res.json({ success: false, message: "Invalid OTP" });
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
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

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

// ❌ REMOVE this (not needed anymore)
// app.use("/uploads", express.static("uploads"));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// ✅ Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// OTP APIs (same as yours)
let generatedOtp = "";

app.post("/OTP", (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.json({ success: false });
  }

  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({ success: true, otp: generatedOtp });
});

app.post("/register", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.json({ success: false });
  }

  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  res.json({ success: true, otp: generatedOtp });
});

app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  if (otp === generatedOtp) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
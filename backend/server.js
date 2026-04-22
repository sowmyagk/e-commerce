require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const stripeRoutes = require("./routes/stripe");

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* STATIC FOLDER */
app.use("/uploads", express.static("uploads"));

/* MONGODB CONNECTION */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

/* ROUTES */
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* OTP LOGIC */
let generatedOtp = "";

/* SEND OTP */
app.post("/OTP", (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.json({ success: false, message: "No input" });
  }

  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("OTP:", generatedOtp);

  res.json({ success: true, otp: generatedOtp });
});

/* REGISTER */
app.post("/register", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.json({ success: false });
  }

  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("Register OTP:", generatedOtp);

  res.json({ success: true, otp: generatedOtp });
});

/* VERIFY OTP */
app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  if (otp === generatedOtp) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

/* START SERVER */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
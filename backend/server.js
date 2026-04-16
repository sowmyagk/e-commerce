require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();
const addressRoutes = require("./routes/addressRoutes");
const stripeRoutes = require("./routes/stripe");

app.use(cors());
app.use(express.json());


app.use("/uploads", express.static("uploads"));

//mongoose
//  .connect("mongodb://127.0.0.1:27017/firstcry")
  
  mongoose.connect(process.env.MONGO_URL)

  .then(() => {
    console.log(" MongoDB connected successfully");
  })
  .catch((err) => {
    console.log(" MongoDB connection error:", err);
  });


app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

//const PORT = 3001;
const PORT = process.env.PORT || 3001;

let generatedOtp = "";


app.post("/OTP", (req, res) => {
  const { value } = req.body;

  if (!value) {
    return res.json({ success: false, message: "No input" });
  }

 
  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("OTP:", generatedOtp);

  res.json({
    success: true,
    otp: generatedOtp
  });
});


app.post("/register", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.json({ success: false });
  }

  generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("Register OTP:", generatedOtp);

  res.json({
    success: true,
    otp: generatedOtp
  });
});


app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  if (otp === generatedOtp) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});









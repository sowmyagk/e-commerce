require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

// ROUTES
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const stripeRoutes = require("./routes/stripe");

// UTILS
const sendEmail = require("./utils/sendEmail");
const generateInvoice = require("./utils/generateInvoice");

// MODELS
const User = require("./models/User");
const Order = require("./models/Order");

const app = express();


// ☁️ CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// 🔧 MIDDLEWARE
app.use(cors());
app.use(express.json());


app.use("/api/payment/webhook", express.raw({ type: "application/json" }));



// 🟢 MONGODB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));


// 🛣️ ROUTES
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);


// ROOT
app.get("/", (req, res) => {
  res.send("API is running...");
});


// =========================
// 🔢 OTP STORE
// =========================
let otpStore = {};


// =========================
// 📩 SEND OTP
// =========================
app.post("/api/otp/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email required" });
    }

    const user = await User.findOne({ email });

    // ⚠️ prevent generating new OTP repeatedly
    if (otpStore[email] && otpStore[email].expires > Date.now()) {
      console.log("⚠️ Using existing OTP:", otpStore[email].otp);
      return res.json({
        success: true,
        isNewUser: !user
      });
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 mins
    };

    console.log("🔢 OTP:", otp, "EMAIL:", email);

    // 📩 Send OTP email
    const emailRes = await sendEmail(email, otp);

    if (emailRes?.error) {
      return res.json({
        success: false,
        message: "Failed to send OTP email"
      });
    }

    return res.json({
      success: true,
      isNewUser: !user,
      otp // ⚠️ REMOVE IN PRODUCTION
    });

  } catch (err) {
    console.log("❌ SEND OTP ERROR:", err);
    return res.json({ success: false, message: "Server error" });
  }
});


// =========================
// ✅ VERIFY OTP
// =========================
app.post("/api/otp/verify", async (req, res) => {
  try {
    const { email, otp, name, phone } = req.body;

    const record = otpStore[email];

    console.log("👉 Entered OTP:", otp);
    console.log("👉 Stored OTP:", record?.otp);

    if (!record) {
      return res.json({
        success: false,
        message: "No OTP found"
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

    // ✅ Create user if new
    let user = await User.findOne({ email });

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
});


// =========================
// 📩 SEND INVOICE (PDF)
// =========================
app.post("/api/send-invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found"
      });
    }

    // ✅ Ensure email exists
    const email = order.email;

    if (!email) {
      return res.json({
        success: false,
        message: "Email not found in order"
      });
    }

    console.log("📧 Sending invoice to:", email);

    // 📄 Generate PDF
    const pdfBuffer = await generateInvoice(order);

    // 📩 Send email with PDF
    const emailRes = await sendEmail(email, null, pdfBuffer);

    if (emailRes?.error) {
      return res.json({
        success: false,
        message: "Email sending failed"
      });
    }

    return res.json({
      success: true,
      message: "Invoice sent successfully"
    });

  } catch (err) {
    console.log("❌ INVOICE ERROR:", err);
    return res.json({
      success: false,
      message: "Server error"
    });
  }
});


// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
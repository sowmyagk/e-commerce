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

const generateInvoice = require("./utils/generateInvoice");
const Order = require("./models/Order");

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// ROUTES
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// OTP STORE
let otpStore = {};

// SEND OTP
app.post("/api/otp/send", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false });
    }

    const user = await User.findOne({ email });

    // prevent overwrite
    if (otpStore[email] && otpStore[email].expires > Date.now()) {
      console.log("⚠️ Using existing OTP:", otpStore[email].otp);
      return res.json({ success: true, isNewUser: !user });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    };

    console.log("🔢 OTP:", otp, "EMAIL:", email);

    await sendEmail(email, otp);

    return res.json({
      success: true,
      isNewUser: !user,
      otp // for demo
    });

  } catch (err) {
    console.log("❌ SEND ERROR:", err);
    return res.json({ success: false });
  }
});

// VERIFY OTP
app.post("/api/otp/verify", async (req, res) => {
  try {
    const { email, otp, name, phone } = req.body;

    const record = otpStore[email];

    console.log("👉 Entered OTP:", otp);
    console.log("👉 Stored OTP:", record?.otp);

    if (!record) {
      return res.json({ success: false, message: "No OTP" });
    }

    if (record.expires < Date.now()) {
      delete otpStore[email];
      return res.json({ success: false, message: "Expired" });
    }

    if (record.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    let user = await User.findOne({ email });

    if (!user && name && phone) {
      user = new User({ name, email, phone });
      await user.save();
    }

    delete otpStore[email];

    return res.json({ success: true });

  } catch (err) {
    console.log(err);
    return res.json({ success: false });
  }
});




// 📩 SEND INVOICE
app.post("/api/send-invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // 📄 Generate PDF
    const pdfBuffer = await generateInvoice(order);

    // 📩 Send email
    await sendEmail(order.email, null, pdfBuffer);

    res.json({ success: true, message: "Invoice sent to email" });

  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
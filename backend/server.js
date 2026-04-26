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


// ✅ CORS (better config)
app.use(cors({
  origin: "*", // later you can restrict frontend URL
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


// ✅ MongoDB (better options)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
  res.status(200).send("API is running...");
});


// ✅ OTP STORE
const otpStore = {};


// ✅ EMAIL VALIDATION
const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};


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

    res.status(200).json({
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


// ✅ VERIFY OTP
app.post("/api/otp/verify", (req, res) => {
  try {
    const { email, otp } = req.body;

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

    res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


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
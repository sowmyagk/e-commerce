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

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch(err => console.log(" MongoDB error:", err));



app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);


app.get("/", (req, res) => {
  res.send(" API is running...");
});


// OTP STORE (per user)
let otpStore = {};


app.post("/api/otp/send", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 mins
  };

  try {
    await sendEmail(email, otp);

    console.log(" OTP SENT:", otp);

    res.json({ success: true });

  } catch (err) {
    console.log(" EMAIL ERROR:", err);
    res.json({ success: false });
  }
});


app.post("/api/otp/verify", async (req, res) => {
  const { email, otp, name, phone } = req.body;

  const record = otpStore[email];

  if (
    record &&
    record.otp === otp &&
    record.expires > Date.now()
  ) {
    try {
      
      let user = await User.findOne({ email });

     
      if (!user && name && phone) {
        user = new User({ name, email, phone });
        await user.save();
      }

      delete otpStore[email];

      return res.json({ success: true });

    } catch (err) {
      console.log(" VERIFY ERROR:", err);
      return res.json({ success: false });
    }
  }

  res.json({ success: false });
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
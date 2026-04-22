//require("dotenv").config();
//const express = require("express");
//const mongoose = require("mongoose");
//const cors = require("cors");
//const User = require("./models/User");
//const productRoutes = require("./routes/productRoutes");
//const cartRoutes = require("./routes/cartRoutes");
//const orderRoutes = require("./routes/orderRoutes");
//const app = express();
//const addressRoutes = require("./routes/addressRoutes");
//const stripeRoutes = require("./routes/stripe");

//app.use(cors());
//app.use(express.json());


//app.use("/uploads", express.static("uploads"));

//mongoose.connect(process.env.MONGO_URI, {
  //useNewUrlParser: true,
 // useUnifiedTopology: true,
//})
//.then(() => console.log("MongoDB connected"))
//.catch(err => console.log(err));


//app.use("/api/products", productRoutes);
//app.use("/api/cart", cartRoutes);
//app.use("/api/orders", orderRoutes);
//app.use("/api/address", addressRoutes);
//app.use("/api/payment", stripeRoutes);

//app.get("/", (req, res) => {
//  res.send("API is running...");
//});


//const PORT = process.env.PORT || 3001;

//let generatedOtp = "";


//app.post("/OTP", (req, res) => {
  //const { value } = req.body;

  //if (!value) {
   // return res.json({ success: false, message: "No input" });
  //}

 
  //generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  //console.log("OTP:", generatedOtp);

  //res.json({
    //success: true,
   // otp: generatedOtp
 // });
//});


//app.post("/register", (req, res) => {
  //const { name, email, phone } = req.body;

  //if (!name || !email || !phone) {
  ///  return res.json({ success: false });
  //}

  //generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  //console.log("Register OTP:", generatedOtp);

  //res.json({
   // success: true,
  //  otp: generatedOtp
 // });
//});


//app.post("/verify-otp", (req, res) => {
  //const { otp } = req.body;

  //if (otp === generatedOtp) {
    //res.json({ success: true });
  //} else {
    //res.json({ success: false });
  //}
//});

//app.listen(PORT, () => {
  //console.log(`Server running on ${PORT}`);
//});








require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const stripeRoutes = require("./routes/stripe");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

/* ✅ FIXED MONGODB CONNECTION */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

/* ROUTES */
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", stripeRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3001;

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

  res.json({
    success: true,
    otp: generatedOtp
  });
});

/* REGISTER */
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
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
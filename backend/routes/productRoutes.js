const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const Product = require("../models/Product");

const router = express.Router();

// ✅ Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// ✅ ADD PRODUCT
router.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    const { name, price, brand, productdescription } = req.body;

    if (!name || !price || !brand || !productdescription || !req.file) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const product = new Product({
      name,
      price,
      brand,
      productdescription,
      image: req.file.path // ✅ CLOUDINARY URL
    });

    await product.save();

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// ✅ GET PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products); // ✅ DIRECT (image already full URL)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ✅ UPDATE
router.put("/update-product/:id", async (req, res) => {
  try {
    const { name, price, brand, productdescription } = req.body;

    await Product.findByIdAndUpdate(req.params.id, {
      name,
      price,
      brand,
      productdescription
    });

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// ✅ DELETE
router.delete("/remove-product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
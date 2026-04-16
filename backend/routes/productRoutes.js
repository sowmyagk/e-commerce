const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });


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
      image: req.file.filename
    });

    await product.save();

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});


router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    const result = products.map(p => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      brand: p.brand,
      productdescription: p.productdescription,
      image: p.image
        ? `http://localhost:3001/uploads/${p.image}`
        : null
    }));

    res.json(result);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});


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
    console.log(error);
    res.status(500).json({ success: false });
  }
});


router.delete("/remove-product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.json({ success: false });

    if (product.image) {
      const imagePath = path.join(__dirname, "..", "uploads", product.image);

      fs.unlink(imagePath, (err) => {
        if (err) console.log("Image delete error:", err);
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
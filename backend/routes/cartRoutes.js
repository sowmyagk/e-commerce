const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");


router.post("/", async (req, res) => {
  try {
    const item = new Cart(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/:userId", async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
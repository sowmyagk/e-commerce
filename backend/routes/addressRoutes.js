
const express = require("express");
const router = express.Router();
const Address = require("../models/Address");


router.post("/add", async (req, res) => {
  try {
    const newAddress = new Address(req.body);
    const saved = await newAddress.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const data = await Address.find();
  res.json(data);
});

module.exports = router;
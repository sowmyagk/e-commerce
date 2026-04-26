const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //price: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true },
  productdescription: { type: String, required: true }, // ✅ FIXED
  image: { type: String, required: true }
});

module.exports = mongoose.model("Product", productSchema);






//const mongoose = require("mongoose");

//const productSchema = new mongoose.Schema({
 // name: String,
 // price: String,
  //brand: String,
//  image: String   
//});

//module.exports = mongoose.model("Product", productSchema);













































//const mongoose = require("mongoose");

//const productSchema = new mongoose.Schema({
 // name: String,
  //price: Number,
 // category: String,
 // description: String,
 // image: String
//});

//module.exports = mongoose.model("Product", productSchema);
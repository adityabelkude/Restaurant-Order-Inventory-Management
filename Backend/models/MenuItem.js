const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  ingredients: [String],
  prepTime: Number
});

module.exports = mongoose.model("MenuItem", menuSchema);
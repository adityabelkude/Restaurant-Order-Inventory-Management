const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: {
    type: String,
    enum: ["appetizer", "main", "dessert"],
  },
  ingredients: [String],
  prepTime: Number
});

module.exports = mongoose.model("Menu", menuSchema);
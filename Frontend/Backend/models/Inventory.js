const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: String,
  stock: Number,
  unit: String,
  lowStockThreshold: Number
});

module.exports = mongoose.model("Inventory", inventorySchema);
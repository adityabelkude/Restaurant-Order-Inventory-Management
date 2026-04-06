const Inventory = require("../models/Inventory");

exports.addItem = async (req, res) => {
  const item = await Inventory.create(req.body);
  res.json(item);
};

exports.getInventory = async (req, res) => {
  const data = await Inventory.find();
  res.json(data);
};
const Menu = require("../models/Menu");

// Get all menu items
exports.getMenu = async (req, res) => {
  const items = await Menu.find();
  res.json(items);
};

// Create new menu item
exports.createItem = async (req, res) => {
  const item = await Menu.create(req.body);
  res.json(item);
};

// Update menu item
exports.updateItem = async (req, res) => {
  const item = await Menu.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(item);
};

// Delete menu item
exports.deleteItem = async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};
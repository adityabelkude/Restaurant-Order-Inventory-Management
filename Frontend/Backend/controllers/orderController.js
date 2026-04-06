const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

// Get all orders
exports.getOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};

// // Create new order
// exports.createOrder = async (req, res) => {
//   const order = await Order.create({
//     items: req.body.items,
//     status: "pending"
//   });

//   const io = req.app.get("io");
//   io.emit("newOrder", order);

//   res.json(order);
// };
//const Inventory = require("../models/Inventory"); // 👈 add at top

exports.createOrder = async (req, res) => {
  if (!req.body.items || req.body.items.length === 0) {
    return res.status(400).json({ message: "No items" });
  }

  const order = await Order.create({
    items: req.body.items,
    status: "pending"
  });

  // 🔥 AUTO-DEDUCT INVENTORY
  for (let item of req.body.items) {
    const inv = await Inventory.findOne({ name: item.name });

    if (inv) {
      inv.stock -= item.quantity;
      await inv.save();
    }
  }

  const io = req.app.get("io");
  io.emit("newOrder", order);
  io.emit("inventoryUpdated");

  res.json(order);
};

// Update order status
exports.updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  const io = req.app.get("io");
  io.emit("orderUpdated", order);

  res.json(order);
};

// Waiter can modify items before kitchen accepts
exports.updateOrderItems = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Order already accepted by kitchen" });
  }

  if (!req.body.items || req.body.items.length === 0) {
    return res.status(400).json({ message: "No items" });
  }

  order.items = req.body.items;
  const updatedOrder = await order.save();

  const io = req.app.get("io");
  io.emit("orderUpdated", updatedOrder);

  res.json(updatedOrder);
};

// Delete order (used by kitchen cleanup as well)
exports.deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (req.user?.role === "waiter" && order.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Waiter can delete only pending orders" });
  }

  await Order.findByIdAndDelete(req.params.id);

  const io = req.app.get("io");
  io.emit("orderDeleted", { id: req.params.id });

  res.json({ message: "Order deleted" });
};
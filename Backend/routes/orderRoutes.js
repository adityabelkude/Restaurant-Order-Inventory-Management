const router = require("express").Router();

const {
  getOrders,
  createOrder,
  updateOrder,
  updateOrderItems,
  deleteOrder
} = require("../controllers/orderController");
const { authRequired, allowRoles } = require("../middleware/authMiddleware");

router.get(
  "/",
  authRequired,
  allowRoles("waiter", "kitchen", "manager", "owner"),
  getOrders
);
router.post("/", authRequired, allowRoles("waiter"), createOrder);
router.put("/:id", authRequired, allowRoles("kitchen"), updateOrder);
router.put("/:id/items", authRequired, allowRoles("waiter"), updateOrderItems);
router.delete(
  "/:id",
  authRequired,
  allowRoles("waiter", "kitchen", "manager", "owner"),
  deleteOrder
);

module.exports = router;
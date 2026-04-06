const router = require("express").Router();
const {
  getMenu,
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/menuController");
const { authRequired, allowRoles } = require("../middleware/authMiddleware");

router.get("/", authRequired, getMenu);
router.post("/", authRequired, allowRoles("manager", "owner"), createItem);
router.put("/:id", authRequired, allowRoles("manager", "owner"), updateItem);
router.delete("/:id", authRequired, allowRoles("manager", "owner"), deleteItem);

module.exports = router;
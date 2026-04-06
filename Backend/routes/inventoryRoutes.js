// const router = require("express").Router();
// const Inventory = require("../models/Inventory");

// // GET
// router.get("/", async (req, res) => {
//   const data = await Inventory.find();
//   res.json(data);
// });

// // POST
// router.post("/", async (req, res) => {
//   const item = await Inventory.create(req.body);
//   res.json(item);
// });

// module.exports = router;
const router = require("express").Router();
const Inventory = require("../models/Inventory");
const { authRequired, allowRoles } = require("../middleware/authMiddleware");

// GET
router.get(
  "/",
  authRequired,
  allowRoles("kitchen", "manager", "owner"),
  async (req, res) => {
  const data = await Inventory.find();
  res.json(data);
});

// POST
router.post(
  "/",
  authRequired,
  allowRoles("manager", "owner"),
  async (req, res) => {
  const item = await Inventory.create(req.body);
  res.json(item);
});

module.exports = router;
const router = require("express").Router();
const {
  clockIn,
  clockOut,
  getShifts
} = require("../controllers/shiftController");
const { authRequired, allowRoles } = require("../middleware/authMiddleware");

router.get("/", authRequired, allowRoles("waiter", "manager", "owner"), getShifts);
router.post("/clock-in", authRequired, allowRoles("waiter"), clockIn);
router.put("/:id/clock-out", authRequired, allowRoles("waiter"), clockOut);

module.exports = router;

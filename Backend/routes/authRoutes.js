const router = require("express").Router();
const { signup, login, me } = require("../controllers/authController");
const { authRequired } = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authRequired, me);

module.exports = router;

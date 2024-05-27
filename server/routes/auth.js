const express = require("express");
const router = express.Router();
const { login, register,verifyEmail } = require("../controllers/auth");

router.post("/", login);
router.post("/register", register);
router.get("/verify/:token", verifyEmail);

module.exports = router;
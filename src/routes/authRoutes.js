const express = require("express");
const { register, login, getAllUsers, deleteUser } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware")

const router = express.Router()
router.post("/register", register)
router.get("/", getAllUsers)
router.delete("/delete/:id", deleteUser)
router.post("/login", login)

module.exports = router;

const express = require("express");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { register, login, getAllUsers, deleteUser, getById } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - phone
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields or user already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Foydalanuvchini ID orqali olish
 *     description: Berilgan ID bo‘yicha foydalanuvchi ma’lumotlarini qaytaradi.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Foydalanuvchi ID-si (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Foydalanuvchi topildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   example:
 *                     _id: 671f5b2dc05a2b3c8c4f78e9
 *                     name: Sardor Madaliyev
 *                     email: sardor@example.com
 *       404:
 *         description: Foydalanuvchi topilmadi
 *       500:
 *         description: Server xatoligi
 */
router.get("/:id", verifyToken, getById);


/**
 * @swagger
 * /auth/:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: All users fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, verifyAdmin, getAllUsers);

/**
 * @swagger
 * /auth/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", verifyToken, verifyAdmin, deleteUser);

module.exports = router;

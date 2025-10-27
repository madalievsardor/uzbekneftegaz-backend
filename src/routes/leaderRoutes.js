const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  create,
  getAllLeader,
  getById,
  update,
  remove,
} = require("../controllers/leaderShipController");

/**
 * @swagger
 * tags:
 *   name: Leadership
 *   description: Rahbarlar CRUD API
 */

/**
 * @swagger
 * /leaders:
 *   post:
 *     summary: Yangi rahbar yaratish
 *     tags: [Leadership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - grade
 *               - phone
 *               - email
 *               - workDays
 *               - workHours
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Ali Valiyev"
 *               grade:
 *                 type: string
 *                 example: "Manager"
 *               phone:
 *                 type: string
 *                 example: "998901234567"
 *               email:
 *                 type: string
 *                 example: "ali@mail.com"
 *               avatar:
 *                 type: string
 *                 example: "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"
 *               workDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Dushanba", "Chorshanba", "Juma"]
 *               workHours:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     example: "09:00"
 *                   end:
 *                     type: string
 *                     example: "18:00"
 *               description:
 *                 type: string
 *                 example: "Rahbar haqida qo‘shimcha ma’lumot"
 *     responses:
 *       201:
 *         description: Rahbar muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rahbar muvafaqiyatli qo'shildi."
 *       400:
 *         description: Barcha maydonlar to'ldirilishi shart
 *       500:
 *         description: Server xatosi
 */

router.post("/", verifyToken, create);

/**
 * @swagger
 * /leaders:
 *   get:
 *     summary: Barcha rahbarlarni olish
 *     tags: [Leadership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rahbarlar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leaders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64f7896b78bdb0c334dcb650"
 *                       fullName:
 *                         type: string
 *                         example: "Ali Valiyev"
 *                       grade:
 *                         type: string
 *                         example: "Manager"
 *                       phone:
 *                         type: string
 *                         example: "998901234567"
 *                       email:
 *                         type: string
 *                         example: "ali@mail.com"
 *                       avatar:
 *                         type: string
 *                         example: "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"
 *                       workDays:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["Dushanba", "Chorshanba", "Juma"]
 *                       workHours:
 *                         type: object
 *                         properties:
 *                           start:
 *                             type: string
 *                             example: "09:00"
 *                           end:
 *                             type: string
 *                             example: "18:00"
 *                       description:
 *                         type: string
 *                         example: "Rahbar haqida qo‘shimcha ma’lumot"
 *       500:
 *         description: Server xatosi
 */
router.get("/",  getAllLeader);


module.exports = router;

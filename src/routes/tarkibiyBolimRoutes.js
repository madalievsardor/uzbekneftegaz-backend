const express = require("express");
const router = express.Router();
const bolimController = require("../controllers/tarkibiyBolimController");
const { verifyToken } = require("../middleware/authMiddleware")
/**
 * @swagger
 * tags:
 *   name: Bolimlar
 *   description: Tarkibiy bo‘limlar bo‘yicha amallar
 */

/**
 * @swagger
 * /bolimlar:
 *   post:
 *     summary: Yangi bo‘lim yaratish
 *     tags: [Bolimlar]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - employees
 *               - leader
 *             properties:
 *               title:
 *                 type: string
 *                 example: Axborot texnologiyalari bo‘limi
 *               employees:
 *                 type: string
 *                 example: 25
 *               leader:
 *                 type: string
 *                 example: Alisher Karimov
 *               description:
 *                 type: string
 *                 example: Bo‘lim axborot tizimlari va texnologiyalarni rivojlantirish uchun mas’ul.
 *     responses:
 *       201:
 *         description: Bo‘lim muvaffaqiyatli yaratildi
 *       400:
 *         description: Majburiy maydonlar to‘ldirilmagan
 *       500:
 *         description: Server xatosi
 */
router.post("/", verifyToken, bolimController.create);


/**
 * @swagger
 * /bolimlar:
 *   get:
 *     summary: Barcha bo‘limlarni olish
 *     tags: [Bolimlar]
 *     responses:
 *       200:
 *         description: Bo‘limlar ro‘yxati
 *       500:
 *         description: Server xatosi
 */
router.get("/", bolimController.getAll);


/**
 * @swagger
 * /bolimlar/{id}:
 *   get:
 *     summary: ID orqali bitta bo‘limni olish
 *     tags: [Bolimlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bo‘lim ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bo‘lim topildi
 *       404:
 *         description: Bo‘lim topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/:id", bolimController.getById);


/**
 * @swagger
 * /bolimlar/{id}:
 *   put:
 *     summary: ID orqali bo‘limni yangilash
 *     tags: [Bolimlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bo‘lim ID si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Kadrlar bo‘limi
 *               employees:
 *                 type: string
 *                 example: 15
 *               leader:
 *                 type: string
 *                 example: Dilshod Raxmonov
 *               description:
 *                 type: string
 *                 example: Kadrlar bilan ishlash va tanlovlar o‘tkazish uchun mas’ul.
 *     responses:
 *       200:
 *         description: Bo‘lim muvaffaqiyatli yangilandi
 *       404:
 *         description: Bo‘lim topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/:id", verifyToken, bolimController.update);


/**
 * @swagger
 * /bolimlar/{id}:
 *   delete:
 *     summary: ID orqali bo‘limni o‘chirish
 *     tags: [Bolimlar]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Bo‘lim ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bo‘lim muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Bo‘lim topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", verifyToken, bolimController.remove);

module.exports = router;

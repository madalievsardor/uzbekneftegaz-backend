const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require("../controllers/vacancyController");

/**
 * @swagger
 * tags:
 *   name: Vacancy
 *   description: Vakansiyalar CRUD API
 */

/**
 * @swagger
 * /vacancies:
 *   post:
 *     summary: Yangi vakansiya yaratish
 *     tags: [Vacancy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - deadline
 *               - salaryType
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   uz: { type: string, example: "Vakansiya nomi (UZ)" }
 *                   oz: { type: string, example: "Вакансия номи (OZ)" }
 *                   ru: { type: string, example: "Название вакансии (RU)" }
 *               description:
 *                 type: object
 *                 properties:
 *                   uz: { type: string, example: "Tavsif (UZ)" }
 *                   oz: { type: string, example: "Тавсиф (OZ)" }
 *                   ru: { type: string, example: "Описание (RU)" }
 *               salary:
 *                 type: object
 *                 properties:
 *                   uz: { type: string, example: "1000 USD (UZ)" }
 *                   oz: { type: string, example: "1000 USD (OZ)" }
 *                   ru: { type: string, example: "1000 USD (RU)" }
 *               requirements:
 *                 type: object
 *                 properties:
 *                   uz: { type: string, example: "Talablar (UZ)" }
 *                   oz: { type: string, example: "Талаблар (OZ)" }
 *                   ru: { type: string, example: "Требования (RU)" }
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               salaryType:
 *                 type: object
 *                 properties:
 *                   uz: { type: string, example: "To'liq stavka" }
 *                   oz: { type: string, example: "Тўлиқ ставка" }
 *                   ru: { type: string, example: "Полная ставка" }
 *     responses:
 *       201:
 *         description: Vakansiya muvaffaqiyatli yaratildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "Vakansiya muvaffaqiyatli yaratildi." }
 *                 vacancy:
 *                   $ref: '#/components/schemas/Vacancy'
 *       400:
 *         description: Majburiy maydonlar to'ldirilishi shart
 *       500:
 *         description: Server xatosi
 */
router.post("/", verifyToken, create);

/**
 * @swagger
 * /vacancies:
 *   get:
 *     summary: Barcha vakansiyalarni olish
 *     tags: [Vacancy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vakansiyalar ro'yxati
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vacancies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vacancy'
 *       500:
 *         description: Server xatosi
 */
router.get("/", getAll);

/**
 * @swagger
 * /vacancies/{id}:
 *   get:
 *     summary: ID orqali vakansiyani olish
 *     tags: [Vacancy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vakansiyaning ObjectID
 *     responses:
 *       200:
 *         description: Vakansiya topildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vacancy:
 *                   $ref: '#/components/schemas/Vacancy'
 *       404:
 *         description: Vakansiya topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /vacancies/{id}:
 *   put:
 *     summary: ID orqali vakansiyani yangilash
 *     tags: [Vacancy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vakansiyaning ObjectID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *               description:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *               salary:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *               requirements:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *               deadline: { type: string, format: date }
 *               salaryType:
 *                 type: object
 *                 properties:
 *                   uz: { type: string }
 *                   oz: { type: string }
 *                   ru: { type: string }
 *     responses:
 *       200:
 *         description: Vakansiya muvaffaqiyatli yangilandi
 *       404:
 *         description: Vakansiya topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/:id", verifyToken, update);

/**
 * @swagger
 * /vacancies/{id}:
 *   delete:
 *     summary: ID orqali vakansiyani o‘chirish
 *     tags: [Vacancy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Vakansiyaning ObjectID
 *     responses:
 *       200:
 *         description: Vakansiya muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Vakansiya topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;

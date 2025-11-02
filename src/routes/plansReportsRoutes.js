const express = require("express");
const router = express.Router();
const {
    create,
    getAll,
    getById,
    update,
    remove,
  } = require("../controllers/plansReportsController");

/**
 * @swagger
 * tags:
 *   name: PlansReports
 *   description: Rejalar va hisobotlar bo‘yicha API'lar
 */

/**
 * @swagger
 * /plans-reports:
 *   post:
 *     summary: Reja yoki hisobot yaratish
 *     tags: [PlansReports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startMoth_uz:
 *                 type: string
 *                 example: "Январ"
 *               startMoth_ru:
 *                 type: string
 *                 example: "Январь"
 *               startMoth_oz:
 *                 type: string
 *                 example: "Yanvar"
 *               endMoth_uz:
 *                 type: string
 *                 example: "Март"
 *               endMoth_ru:
 *                 type: string
 *                 example: "Март"
 *               endMoth_oz:
 *                 type: string
 *                 example: "Mart"
 *               title_uz:
 *                 type: string
 *                 example: "I chorak reja"
 *               title_ru:
 *                 type: string
 *                 example: "План на 1 квартал"
 *               title_oz:
 *                 type: string
 *                 example: "I chorak reja"
 *               description_uz:
 *                 type: string
 *                 example: "Январ-март ойлари учун режа"
 *               description_ru:
 *                 type: string
 *                 example: "План на январь-март"
 *               description_oz:
 *                 type: string
 *                 example: "Yanvar-mart oylari uchun reja"
 *               participantsCount:
 *                 type: integer
 *                 example: 25
 *               category_uz:
 *                 type: string
 *                 enum: ["Режа", "Хисобот"]
 *               category_ru:
 *                 type: string
 *                 enum: ["План", "Отчет"]
 *               category_oz:
 *                 type: string
 *                 enum: ["Reja", "Hisobot"]
 *     responses:
 *       201:
 *         description: Yangi reja yoki hisobot yaratildi
 *       400:
 *         description: Maydonlar to‘ldirilmagan
 *       500:
 *         description: Server xatosi
 */
router.post("/", create);

/**
 * @swagger
 * /plans-reports:
 *   get:
 *     summary: Barcha rejalar va hisobotlarni olish
 *     tags: [PlansReports]
 *     responses:
 *       200:
 *         description: Barcha rejalar ro‘yxati
 *       500:
 *         description: Server xatosi
 */
router.get("/", getAll);

/**
 * @swagger
 * /plans-reports/{id}:
 *   get:
 *     summary: ID orqali reja yoki hisobotni olish
 *     tags: [PlansReports]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Reja yoki hisobotning ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topilgan reja yoki hisobot
 *       400:
 *         description: Noto‘g‘ri ID formati
 *       404:
 *         description: Ma’lumot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /plans-reports/{id}:
 *   put:
 *     summary: Reja yoki hisobotni yangilash
 *     tags: [PlansReports]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilanadigan ma’lumot ID si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title_uz:
 *                 type: string
 *                 example: "Yangilangan reja"
 *               description_uz:
 *                 type: string
 *                 example: "Yangilangan izoh"
 *               participantsCount:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli yangilandi
 *       404:
 *         description: Ma’lumot topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/:id", update);

/**
 * @swagger
 * /plans-reports/{id}:
 *   delete:
 *     summary: Reja yoki hisobotni o‘chirish
 *     tags: [PlansReports]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O‘chiriladigan ma’lumot ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", remove);

module.exports = router;

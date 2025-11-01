const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const newsController = require("../controllers/newsController");

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Yangiliklar bo‘limi
 */

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Yangi yangilik yaratish
 *     tags: [News]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Yangilik sarlavhasi
 *                 example: "Yangi gaz quvuri ishga tushdi"
 *               description:
 *                 type: string
 *                 description: Yangilik tavsifi
 *                 example: "Bugun yangi gaz quvuri foydalanishga topshirildi..."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Yangilik rasmi
 *     responses:
 *       201:
 *         description: Yangilik muvaffaqiyatli yaratildi
 *       400:
 *         description: Ma'lumotlar to‘liq emas yoki xato
 *       500:
 *         description: Serverda xatolik
 */
router.post("/", upload.array("images", 10), newsController.create);

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Barcha yangiliklarni olish
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Barcha yangiliklar ro‘yxati
 *       500:
 *         description: Serverda xatolik
 */
router.get("/", newsController.getAll);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: ID bo‘yicha bitta yangilikni olish
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Yangilikning ID si
 *         schema:
 *           type: string
 *           example: 671f2ab937e2d1b7c3a8b2d1
 *     responses:
 *       200:
 *         description: Yangilik topildi
 *       400:
 *         description: Noto‘g‘ri ID formati
 *       404:
 *         description: Yangilik topilmadi
 *       500:
 *         description: Serverda xatolik
 */
router.get("/:id", newsController.getById);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Yangilikni yangilash
 *     tags: [News]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Yangilanishi kerak bo‘lgan yangilikning ID si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Yangilangan sarlavha"
 *               description:
 *                 type: string
 *                 example: "Yangilangan tavsif"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Qo‘shimcha rasmlar
 *     responses:
 *       200:
 *         description: Yangilik muvaffaqiyatli yangilandi
 *       400:
 *         description: Noto‘g‘ri ID formati yoki xato ma'lumot
 *       404:
 *         description: Yangilik topilmadi
 *       500:
 *         description: Serverda xatolik
 */
router.put("/:id", upload.array("images", 10), newsController.update);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: ID bo‘yicha yangilikni o‘chirish
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: O‘chiriladigan yangilikning ID si
 *         schema:
 *           type: string
 *           example: 671f2ab937e2d1b7c3a8b2d1
 *     responses:
 *       200:
 *         description: Yangilik o‘chirildi
 *       400:
 *         description: Noto‘g‘ri ID formati
 *       404:
 *         description: Yangilik topilmadi
 *       500:
 *         description: Serverda xatolik
 */
router.delete("/:id", newsController.remove);

module.exports = router;

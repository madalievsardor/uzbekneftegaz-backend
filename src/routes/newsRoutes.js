const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  create,
  getAll,
  getById,
  update,
  remove,
} = require("../controllers/newsController");

/**
 * @swagger
 * tags:
 *   name: News
 *   description: Yangiliklar CRUD API
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
 *                 example: "Yangi loyiha ishga tushirildi"
 *               description:
 *                 type: string
 *                 example: "Bugun Neftegaz korxonasida yangi loyiha ishga tushirildi."
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Yangilik muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto‘g‘ri so‘rov
 *       500:
 *         description: Server xatosi
 */
router.post("/", upload.array("images", 10), create);

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
 *         description: Server xatosi
 */
router.get("/", getAll);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: ID orqali yangilikni olish
 *     tags: [News]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Yangilik ID raqami
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yangilik topildi
 *       404:
 *         description: Yangilik topilmadi
 *       500:
 *         description: Server xatosi
 */
router.get("/:id", getById);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: ID orqali yangilikni yangilash
 *     tags: [News]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
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
 *     responses:
 *       200:
 *         description: Yangilik muvaffaqiyatli yangilandi
 *       404:
 *         description: Yangilik topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put("/:id", upload.array("images", 10), update);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: ID orqali yangilikni o‘chirish
 *     tags: [News]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yangilik muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Yangilik topilmadi
 *       500:
 *         description: Server xatosi
 */
router.delete("/:id", remove);

module.exports = router;

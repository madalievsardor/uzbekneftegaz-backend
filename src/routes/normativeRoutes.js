const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const controller = require("../controllers/normativeController");

/**
 * @swagger
 * tags:
 *   name: NormativeDocument
 *   description: Normativ-huquqiy hujjatlar uchun CRUD API
 */

/**
 * @swagger
 * /normative/create:
 *   post:
 *     summary: Yangi normativ hujjat yaratish
 *     tags: [NormativeDocument]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Davlat qarori"
 *               decree:
 *                 type: string
 *                 example: "PQ-1234"
 *               description:
 *                 type: string
 *                 example: "Bu qaror davlat boshqaruvi tizimini takomillashtirishga oid."
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "PDF, DOCX yoki ZIP fayl"
 *     responses:
 *       201:
 *         description: Hujjat muvaffaqiyatli yaratildi
 *       400:
 *         description: Fayl yoki maydonlar kiritilmagan
 */
router.post("/create", upload.single("file"), controller.create);

/**
 * @swagger
 * /normative:
 *   get:
 *     summary: Barcha normativ hujjatlarni olish
 *     tags: [NormativeDocument]
 *     responses:
 *       200:
 *         description: Barcha hujjatlar ro‘yxati
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /normative/{id}:
 *   get:
 *     summary: ID bo‘yicha bitta normativ hujjatni olish
 *     tags: [NormativeDocument]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Hujjatning ID raqami
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topilgan hujjat
 *       404:
 *         description: Hujjat topilmadi
 */
router.get("/:id", controller.getById);

/**
 * @swagger
 * /normative/update/{id}:
 *   put:
 *     summary: Normativ hujjatni yangilash (fayl ixtiyoriy)
 *     tags: [NormativeDocument]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilanadigan hujjat ID si
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
 *                 example: "Yangilangan qaror nomi"
 *               decree:
 *                 type: string
 *                 example: "PQ-9999"
 *               description:
 *                 type: string
 *                 example: "Yangilangan hujjat mazmuni"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: "Yangi fayl (ixtiyoriy)"
 *     responses:
 *       200:
 *         description: Hujjat muvaffaqiyatli yangilandi
 *       404:
 *         description: Hujjat topilmadi
 */
router.put("/update/:id", upload.single("file"), controller.update);

/**
 * @swagger
 * /normative/delete/{id}:
 *   delete:
 *     summary: Normativ hujjatni o‘chirish
 *     tags: [NormativeDocument]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: O‘chiriladigan hujjat ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hujjat muvaffaqiyatli o‘chirildi
 *       404:
 *         description: Hujjat topilmadi
 */
router.delete("/delete/:id", controller.remove);

module.exports = router;

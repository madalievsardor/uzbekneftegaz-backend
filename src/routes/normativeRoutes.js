const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware")
const upload = require("../middleware/upload"); // multer fayl yuklash middleware
const normativeDocumentController = require("../controllers/normativeController");

/**
 * @swagger
 * tags:
 *   name: NormativeDocument
 *   description: 🧾 Normativ hujjatlar uchun CRUD API
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
 *             required:
 *               - file
 *               - title_uz
 *               - decree_uz
 *               - description_uz
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Yuklanadigan PDF, DOC yoki ZIP fayl
 *               # -----------------------------
 *               # 🏷️ Sarlavha (title)
 *               # -----------------------------
 *               title_uz:
 *                 type: string
 *                 description: Hujjat nomi (O‘zbekcha)
 *                 example: "Qaror to‘g‘risida"
 *               title_ru:
 *                 type: string
 *                 description: Hujjat nomi (Ruscha)
 *                 example: "О постановлении"
 *               title_oz:
 *                 type: string
 *                 description: Hujjat nomi (Lotincha)
 *                 example: "Qaror haqida"
 *               # -----------------------------
 *               # 📜 Qaror raqami (decree)
 *               # -----------------------------
 *               decree_uz:
 *                 type: string
 *                 description: Qaror yoki farmon raqami (O‘zbekcha)
 *                 example: "123-sonli qaror"
 *               decree_ru:
 *                 type: string
 *                 description: Qaror yoki farmon raqami (Ruscha)
 *                 example: "Постановление №123"
 *               decree_oz:
 *                 type: string
 *                 description: Qaror yoki farmon raqami (Lotincha)
 *                 example: "123-son qaror"
 *               # -----------------------------
 *               # 🧾 Tavsif (description)
 *               # -----------------------------
 *               description_uz:
 *                 type: string
 *                 description: Tavsif (O‘zbekcha)
 *                 example: "Ushbu qaror moliya sohasiga taalluqlidir."
 *               description_ru:
 *                 type: string
 *                 description: Tavsif (Ruscha)
 *                 example: "Это постановление связано с финансовым сектором."
 *               description_oz:
 *                 type: string
 *                 description: Tavsif (Lotincha)
 *                 example: "Bu qaror moliya sohasi haqida."
 *     responses:
 *       201:
 *         description: Hujjat muvaffaqiyatli yaratildi
 *       400:
 *         description: Noto‘g‘ri maʼlumot kiritilgan
 *       500:
 *         description: Serverda xatolik
 */
router.post(
  "/create", verifyToken,
  upload.single("file"),
  normativeDocumentController.create
);


/**
 * @swagger
 * /normative/all:
 *   get:
 *     summary: Barcha normativ hujjatlarni olish
 *     tags: [NormativeDocument]
 *     responses:
 *       200:
 *         description: Hamma hujjatlar ro‘yxati
 *       500:
 *         description: Server xatosi
 */
router.get("/all", normativeDocumentController.getAll);

/**
 * @swagger
 * /normative/{id}:
 *   get:
 *     summary: ID orqali bitta normativ hujjatni olish
 *     tags: [NormativeDocument]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Hujjat ID si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hujjat maʼlumotlari
 *       404:
 *         description: Hujjat topilmadi
 */
router.get("/:id", normativeDocumentController.getById);

/**
 * @swagger
 * /normative/update/{id}:
 *   put:
 *     summary: Normativ hujjatni yangilash (fayl majburiy emas)
 *     tags: [NormativeDocument]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Yangilanayotgan hujjat ID si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Yangi yuklanadigan fayl
 *               title:
 *                 type: string
 *                 description: JSON formatda — {"uz":"...", "ru":"...", "oz":"..."}
 *               decree:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hujjat yangilandi
 *       404:
 *         description: Hujjat topilmadi
 *       500:
 *         description: Server xatosi
 */
router.put(
  "/update/:id", verifyToken,
  upload.single("file"),
  normativeDocumentController.update
);

/**
 * @swagger
 * /normative/delete/{id}:
 *   delete:
 *     summary: Hujjatni o‘chirish
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
 *       500:
 *         description: Server xatosi
 */
router.delete("/delete/:id", verifyToken, normativeDocumentController.remove);

module.exports = router;

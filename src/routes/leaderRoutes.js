const express = require("express");
const router = express.Router();
const {
  create,
  getAllLeader,
  update,
  remove,
} = require("../controllers/leaderShipController");
const upload = require("../middleware/upload")
const { verifyToken } = require("../middleware/authMiddleware")
/**
 * @swagger
 * tags:
 *   name: Leader
 *   description: Рахбарлар (уз, оз, ру тилларда)
 */

/**
 * @swagger
 * /leader/create:
 *   post:
 *     summary: Yangi rahbar qo‘shish
 *     tags: [Leader]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName_uz:
 *                 type: string
 *                 example: "Aliyev Azizbek"
 *               fullName_oz:
 *                 type: string
 *                 example: "Алиев Азизбек"
 *               fullName_ru:
 *                 type: string
 *                 example: "Алиев Азизбек"
 *               grade_uz:
 *                 type: string
 *                 example: "Direktor"
 *               grade_oz:
 *                 type: string
 *                 example: "Директор"
 *               grade_ru:
 *                 type: string
 *                 example: "Директор"
 *               phone:
 *                 type: string
 *                 example: "+998900112233"
 *               email:
 *                 type: string
 *                 example: "aziz@mail.com"
 *               avatar:
 *                 type: string
 *                 format: binary
 *               workDays_uz:
 *                 type: string
 *                 example: "Dushanba - Juma"
 *               workDays_oz:
 *                 type: string
 *                 example: "Душанба - Жума"
 *               workDays_ru:
 *                 type: string
 *                 example: "Понедельник - Пятница"
 *               workHours_start:
 *                 type: string
 *                 example: "09:00"
 *               workHours_end:
 *                 type: string
 *                 example: "18:00"
 *               description_uz:
 *                 type: string
 *                 example: "10 yillik tajribaga ega rahbar."
 *               description_oz:
 *                 type: string
 *                 example: "10 йиллик тажрибага эга раҳбар."
 *               description_ru:
 *                 type: string
 *                 example: "Руководитель с 10-летним опытом."
 *     responses:
 *       201:
 *         description: Rahbar muvaffaqiyatli qo‘shildi
 *       400:
 *         description: Noto‘g‘ri ma’lumot yoki yetishmayotgan maydon
 */
router.post("/create", verifyToken, upload.single("avatar"), create);

/**
 * @swagger
 * /leader:
 *   get:
 *     summary: Барча раҳбарларни олиш
 *     tags: [Leader]
 *     responses:
 *       200:
 *         description: Барча раҳбарлар рўйхати
 */
router.get("/", getAllLeader);




/**
 * @swagger
 * /leader/update/{id}:
 *   put:
 *     summary: Rahbar ma'lumotlarini yangilash (uz, oz, ru tillarda)
 *     tags: [Leader]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Rahbarning ID si
 *         schema:
 *           type: string
 *           example: 6726123b8c8a53a44d5a7c9a
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName_uz:
 *                 type: string
 *                 example: Aliyev Azizbek
 *               fullName_oz:
 *                 type: string
 *                 example: Алиев Азизбек
 *               fullName_ru:
 *                 type: string
 *                 example: Алиев Азизбек
 *               grade_uz:
 *                 type: string
 *                 example: Direktor
 *               grade_oz:
 *                 type: string
 *                 example: Директор
 *               grade_ru:
 *                 type: string
 *                 example: Директор
 *               phone:
 *                 type: string
 *                 example: +998901234567
 *               email:
 *                 type: string
 *                 example: azizbek@company.uz
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Rahbar rasmi (jpg/png)
 *               workDays_uz:
 *                 type: string
 *                 example: Dushanba - Juma
 *               workDays_oz:
 *                 type: string
 *                 example: Душанба - Жума
 *               workDays_ru:
 *                 type: string
 *                 example: Понедельник - Пятница
 *               workHours_start:
 *                 type: string
 *                 example: "09:00"
 *               workHours_end:
 *                 type: string
 *                 example: "18:00"
 *               description_uz:
 *                 type: string
 *                 example: 10 yillik tajribaga ega rahbar.
 *               description_oz:
 *                 type: string
 *                 example: 10 йиллик тажрибага эга раҳбар.
 *               description_ru:
 *                 type: string
 *                 example: Руководитель с 10-летним опытом.
 *     responses:
 *       200:
 *         description: ✅ Rahbar muvaffaqiyatli yangilandi
 *       400:
 *         description: ❌ Noto‘g‘ri so‘rov
 *       404:
 *         description: ❌ Rahbar topilmadi
 *       500:
 *         description: ❌ Server xatosi
 */
router.put("/update/:id", verifyToken, upload.single("avatar"), update);



/**
 * @swagger
 * /leader/{id}:
 *   delete:
 *     summary: Раҳбарни ўчириш
 *     tags: [Leader]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Раҳбар ўчирилди
 *       404:
 *         description: Раҳбар топилмади
 */
router.delete("/:id", verifyToken, remove);

module.exports = router;

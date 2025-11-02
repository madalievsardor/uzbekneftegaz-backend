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
 * /leader:
 *   post:
 *     summary: Янги раҳбар қўшиш (ўзбек, кирилл ва рус тилларида)
 *     tags: [Leader]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: "Yuklanadigan rasm fayli (.jpg, .png, .jpeg)"
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
 *                 example: "azizbek@mail.com"
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
 *         description: Раҳбар муваффақиятли қўшилди
 *       400:
 *         description: Мажбурий майдонлар тўлдирилмаган
 *       500:
 *         description: Серверда хатолик
 */
router.post("/", verifyToken, upload.single("avatar"), create);


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
 *     summary: Раҳбар маълумотларини янгилаш (ўзбек, кирилл ва рус тилларида)
 *     tags: [Leader]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Янгиланадиган раҳбарнинг ID си
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     example: "Aliyev Azizbek"
 *                   oz:
 *                     type: string
 *                     example: "Алиев Азизбек"
 *                   ru:
 *                     type: string
 *                     example: "Алиев Азизбек"
 *               grade:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     example: "Direktor o‘rinbosari"
 *                   oz:
 *                     type: string
 *                     example: "Директор ўринбосари"
 *                   ru:
 *                     type: string
 *                     example: "Заместитель директора"
 *               phone:
 *                 type: string
 *                 example: "+998901234567"
 *               email:
 *                 type: string
 *                 example: "azizbek_updated@mail.com"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/avatar_updated.jpg"
 *               workDays:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     example: "Dushanba - Shanba"
 *                   oz:
 *                     type: string
 *                     example: "Душанба - Шанба"
 *                   ru:
 *                     type: string
 *                     example: "Понедельник - Суббота"
 *               workHours:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     example: "08:00"
 *                   end:
 *                     type: string
 *                     example: "17:00"
 *               description:
 *                 type: object
 *                 properties:
 *                   uz:
 *                     type: string
 *                     example: "Yangilangan lavozimga tayinlandi."
 *                   oz:
 *                     type: string
 *                     example: "Янгиланган лавозимга тайинланди."
 *                   ru:
 *                     type: string
 *                     example: "Назначен на новую должность."
 *     responses:
 *       200:
 *         description: Раҳбар маълумотлари муваффақиятли янгиланди
 *       404:
 *         description: Раҳбар топилмади
 *       500:
 *         description: Серверда хатолик
 */
router.put("/update/:id", verifyToken, update);


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

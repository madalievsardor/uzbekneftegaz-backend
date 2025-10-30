const NormativeDocument = require("../models/normativeDocumentModel");
const path = require("path");
const fs = require("fs");

/**
 * 📤 Yangi normativ hujjat yaratish
 * Fayl multer orqali yuklanadi
 */
exports.create = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Fayl yuklanmagan! Iltimos, fayl yuboring." });
    }

    const { title, decree, description } = req.body;

    // Ma'lumotlar to‘liq kiritilganligini tekshiramiz
    if (!title || !decree || !description) {
      return res
        .status(400)
        .json({ message: "Barcha maydonlar to‘ldirilishi kerak!" });
    }

    // Yangi hujjat yaratamiz
    const newDocument = new NormativeDocument({
      title,
      decree,
      description,
      file: req.file.filename, // Yuklangan fayl nomi
      fileType: req.file.mimetype,
    });

    await newDocument.save();
    res.status(201).json({
      message: "Normativ hujjat muvaffaqiyatli yaratildi ✅",
      data: newDocument,
    });
  } catch (error) {
    console.error("❌ Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi!", error });
  }
};

/**
 * 📚 Barcha normativ hujjatlarni olish
 */
exports.getAll = async (req, res) => {
  try {
    const documents = await NormativeDocument.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha hujjatlar", data: documents });
  } catch (error) {
    res.status(500).json({ message: "Ma'lumotlarni olishda xatolik", error });
  }
};

/**
 * 🔍 Bitta hujjatni ID orqali olish
 */
exports.getById = async (req, res) => {
  try {
    const document = await NormativeDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }
    res.status(200).json({ data: document });
  } catch (error) {
    res.status(500).json({ message: "Xatolik yuz berdi", error });
  }
};

/**
 * ✏️ Hujjatni yangilash (fayl ixtiyoriy)
 */
exports.update = async (req, res) => {
  try {
    const { title, decree, description } = req.body;
    const document = await NormativeDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }

    // Agar yangi fayl yuklansa — eski faylni o‘chirib tashlaymiz
    if (req.file) {
      const oldFilePath = path.join(__dirname, "../uploads/files", document.file);
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

      document.file = req.file.filename;
      document.fileType = req.file.mimetype;
    }

    // Yozuvlarni yangilaymiz
    document.title = title || document.title;
    document.decree = decree || document.decree;
    document.description = description || document.description;

    await document.save();

    res.status(200).json({
      message: "Hujjat muvaffaqiyatli yangilandi ✅",
      data: document,
    });
  } catch (error) {
    res.status(500).json({ message: "Yangilashda xatolik yuz berdi", error });
  }
};

/**
 * 🗑 Hujjatni o‘chirish
 */
exports.remove = async (req, res) => {
  try {
    const document = await NormativeDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }

    // Faylni o‘chiramiz
    const filePath = path.join(__dirname, "../uploads/files", document.file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await NormativeDocument.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hujjat muvaffaqiyatli o‘chirildi ✅" });
  } catch (error) {
    res.status(500).json({ message: "O‘chirishda xatolik yuz berdi", error });
  }
};

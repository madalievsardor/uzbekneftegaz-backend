const NormativeDocument = require("../models/normativeDocumentModel");
const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

/**
 * 📤 Yangi normativ hujjat yaratish
 */
exports.create = async (req, res) => {
  try {
    const {
      title_uz,
      title_ru,
      title_oz,
      decree_uz,
      decree_ru,
      decree_oz,
      description_uz,
      description_ru,
      description_oz,
    } = req.body;

    // Fayl yo‘qligini tekshiramiz
    if (!req.file) {
      return res.status(400).json({ message: "Fayl yuklanmagan!" });
    }

    // Majburiy maydonlarni tekshirish
    if (!title_uz || !decree_uz || !description_uz) {
      return res.status(400).json({
        message:
          "Majburiy maydonlar (title_uz, decree_uz, description_uz) to'ldirilishi kerak!",
        uploadedFile: req.file.filename,
      });
    }

    // Yangi hujjat yaratish
    const newDocument = new NormativeDocument({
      title: {
        uz: title_uz,
        ru: title_ru || "",
        oz: title_oz || "",
      },
      decree: {
        uz: decree_uz,
        ru: decree_ru || "",
        oz: decree_oz || "",
      },
      description: {
        uz: description_uz,
        ru: description_ru || "",
        oz: description_oz || "",
      },
      file: req.file.filename,
      fileType: req.file.mimetype,
    });

    await newDocument.save();

    res.status(201).json({
      message: "Normativ hujjat muvaffaqiyatli yaratildi!",
      data: newDocument,
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({
      message: "Serverda xatolik yuz berdi!",
      error: error.message,
    });
  }
};


/**
 * 📚 Barcha hujjatlar
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
 * 🔍 ID orqali olish
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" })
    }
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
 * ✏️ Yangilash
 */
exports.update = async (req, res) => {
  try {
    const { title, decree, description } = req.body;
    const document = await NormativeDocument.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }

    // Agar yangi fayl yuklansa, eski faylni o‘chiramiz
    if (req.file) {
      const oldFilePath = path.join(__dirname, "../uploads/files", document.file);
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      document.file = req.file.filename;
      document.fileType = req.file.mimetype;
    }

    // Faqat kiritilgan qiymatlarni yangilaymiz
    if (title) document.title = JSON.parse(title);
    if (decree) document.decree = JSON.parse(decree);
    if (description) document.description = JSON.parse(description);

    await document.save();

    res.status(200).json({
      message: "Hujjat muvaffaqiyatli yangilandi ✅",
      data: document,
    });
  } catch (error) {
    console.error("❌ Yangilash xatosi:", error);
    res.status(500).json({ message: "Yangilashda xatolik yuz berdi", error });
  }
};

/**
 * 🗑 O‘chirish
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({message: "Noto'g'ri ID format"})
    }
    const document = await NormativeDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: "Hujjat topilmadi!" });
    }

    // Faylni o‘chirish
    const filePath = path.join(__dirname, "../uploads/files", document.file);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await NormativeDocument.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hujjat muvaffaqiyatli o‘chirildi ✅" });
  } catch (error) {
    res.status(500).json({ message: "O‘chirishda xatolik yuz berdi", error });
  }
};

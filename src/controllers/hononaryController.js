const honoraryModel = require("../models/honoraryOfficerModel");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

/**
 * 📤 Yangi faxriy xodim yaratish
 */
exports.create = async (req, res) => {
  try {
    const {
      fullName_uz, fullName_ru, fullName_oz,
      specialist_uz, specialist_ru, specialist_oz,
      experience_uz, experience_ru, experience_oz,
      project_uz, project_ru, project_oz,
      grade_uz, grade_ru, grade_oz,
      description_uz, description_ru, description_oz
    } = req.body;

    // ✅ Majburiy maydonlar
    if (!fullName_uz || !specialist_uz || !grade_uz) {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Fayl yuklangan bo‘lsa o‘chirib yuboramiz
      }
      return res.status(400).json({
        message: "❌ UZ tilidagi maydonlar to‘ldirilishi shart: fullName, specialist, grade"
      });
    }

    // ✅ Fayl mavjudligini va turini tekshirish
    if (req.file && !req.file.mimetype.startsWith("image")) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "❌ Faqat rasm yuklash mumkin" });
    }

    // ✅ Model yaratish
    const newHonorary = new honoraryModel({
      fullName: { uz: fullName_uz, ru: fullName_ru || "", oz: fullName_oz || "" },
      specialist: { uz: specialist_uz, ru: specialist_ru || "", oz: specialist_oz || "" },
      experience: { uz: experience_uz || "", ru: experience_ru || "", oz: experience_oz || "" },
      project: { uz: project_uz || "", ru: project_ru || "", oz: project_oz || "" },
      grade: { uz: grade_uz, ru: grade_ru || "", oz: grade_oz || "" },
      description: { uz: description_uz || "", ru: description_ru || "", oz: description_oz || "" },
      image: req.file ? req.file.filename : null
    });

    await newHonorary.save();
    res.status(201).json({ message: "✅ Faxriy xodim muvaffaqiyatli yaratildi", data: newHonorary });
  } catch (error) {
    console.error("❌ Xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi", error: error.message });
  }
};

/**
 * 📚 Barcha faxriy xodimlarni olish
 */
exports.getAll = async (req, res) => {
  try {
    const allHonorary = await honoraryModel.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha faxriy xodimlar", data: allHonorary });
  } catch (error) {
    res.status(500).json({ message: "Ma'lumot olishda xatolik", error: error.message });
  }
};

/**
 * 🔍 Bitta xodimni ID orqali olish
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });

    const officer = await honoraryModel.findById(id);
    if (!officer) return res.status(404).json({ message: "❌ Xodim topilmadi" });

    res.status(200).json({ data: officer });
  } catch (error) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
  }
};

/**
 * ✏️ Xodimni yangilash
 */
exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });

    const officer = await honoraryModel.findById(id);
    if (!officer) return res.status(404).json({ message: "❌ Xodim topilmadi" });

    const {
      fullName_uz, fullName_ru, fullName_oz,
      specialist_uz, specialist_ru, specialist_oz,
      experience_uz, experience_ru, experience_oz,
      project_uz, project_ru, project_oz,
      grade_uz, grade_ru, grade_oz,
      description_uz, description_ru, description_oz
    } = req.body;

    // ✅ Rasm almashtirish
    if (req.file) {
      if (!req.file.mimetype.startsWith("image")) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "❌ Faqat rasm yuklash mumkin" });
      }

      const oldFile = path.join(__dirname, "../uploads/honorary", officer.image);
      if (fs.existsSync(oldFile)) {
        try {
          fs.unlinkSync(oldFile);
        } catch (err) {
          console.warn("⚠️ Eski rasmni o‘chirishda xatolik:", err.message);
        }
      }
      officer.image = req.file.filename;
    }

    // ✅ Maydonlarni yangilash
    officer.fullName = {
      uz: fullName_uz || officer.fullName.uz,
      ru: fullName_ru || officer.fullName.ru,
      oz: fullName_oz || officer.fullName.oz
    };

    officer.specialist = {
      uz: specialist_uz || officer.specialist.uz,
      ru: specialist_ru || officer.specialist.ru,
      oz: specialist_oz || officer.specialist.oz
    };

    officer.experience = {
      uz: experience_uz || officer.experience.uz,
      ru: experience_ru || officer.experience.ru,
      oz: experience_oz || officer.experience.oz
    };

    officer.project = {
      uz: project_uz || officer.project.uz,
      ru: project_ru || officer.project.ru,
      oz: project_oz || officer.project.oz
    };

    officer.grade = {
      uz: grade_uz || officer.grade.uz,
      ru: grade_ru || officer.grade.ru,
      oz: grade_oz || officer.grade.oz
    };

    officer.description = {
      uz: description_uz || officer.description.uz,
      ru: description_ru || officer.description.ru,
      oz: description_oz || officer.description.oz
    };

    await officer.save();
    res.status(200).json({ message: "✅ Xodim yangilandi", data: officer });
  } catch (error) {
    console.error("❌ Yangilash xatosi:", error);
    res.status(500).json({ message: "Yangilashda xatolik yuz berdi", error: error.message });
  }
};

/**
 * 🗑 Xodimni o‘chirish
 */
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });

    const officer = await honoraryModel.findById(id);
    if (!officer) return res.status(404).json({ message: "❌ Xodim topilmadi" });

    // ✅ Faylni o‘chirish
    if (officer.image) {
      const filePath = path.join(__dirname, "../uploads/honorary", officer.image);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn("⚠️ Faylni o‘chirishda xatolik:", err.message);
        }
      }
    }

    await honoraryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "🗑️ Xodim o‘chirildi" });
  } catch (error) {
    console.error("❌ O‘chirish xatosi:", error);
    res.status(500).json({ message: "O‘chirishda xatolik yuz berdi", error: error.message });
  }
};

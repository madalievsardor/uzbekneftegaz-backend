const bannerModel = require("../models/bannerModel");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose")
// 🟢 Banner yaratish
exports.create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Fayl yuklanmadi" });
    }

    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;
    if(!title_uz) {
      return res.status(400).json({message: "Sarlavha (Uz) mavburiy maydon"})
    }
    const maxLength = 300;
    if (
      (title_uz && title_uz.length > maxLength) ||
      (title_ru && title_ru.length > maxLength) ||
      (title_oz && title_oz.length > maxLength)
    ) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: `Sarlavha uzunligi ${maxLength} belgidan oshmasligi kerak` });
    }
    const mediaType = req.file.mimetype.startsWith("image") ? "image" : "video";
    const newBanner = new bannerModel({
      file: req.file.filename,
      title: {
        uz: title_uz,
        ru: title_ru,
        oz: title_oz
      },
      description: {
        uz: desc_uz,
        ru: desc_ru,
        oz: desc_oz
      },
      mediaType,
    });

    await newBanner.save();
    res.status(201).json({ message: "Banner yaratildi", banner: newBanner });
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

// 🔵 Barcha bannerlarni olish
exports.getAll = async (req, res) => {
  try {
    const banners = await bannerModel.find().sort({ createdAt: -1 });
    res.status(200).json({message: "All users", banners});
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

// 🟣 Bitta banner (ID orqali)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID formatini tekshiramiz
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner topilmadi" });
    }

    res.status(200).json({ message: "Banner topildi", data: banner });
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

// 🟠 Banner yangilash (faylni ham o'zgartirish mumkin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format!" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "❌ Hujjat topilmadi!" });
    }

    // --- Fayl yangilanishi ---
    if (req.file) {
      const oldFilePath = path.join(__dirname, "../uploads/banners", banner.file);
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

      banner.file = req.file.filename;
      banner.mediaType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    }

    const { title_uz, title_ru, title_oz, description_uz, description_ru, description_oz } = req.body;

    // --- title yangilash ---
    if (title_uz || title_ru || title_oz) {
      if (!title_uz || title_uz.trim() === "") {
        return res.status(400).json({ message: "❌ title_uz majburiy!" });
      }
      banner.title = {
        uz: title_uz || banner.title.uz,
        ru: title_ru || banner.title.ru,
        oz: title_oz || banner.title.oz,
      };
    }

    // --- description yangilash ---
    if (description_uz || description_ru || description_oz) {
      if (!description_uz || description_uz.trim() === "") {
        return res.status(400).json({ message: "❌ description_uz majburiy!" });
      }
      banner.description = {
        uz: description_uz || banner.description.uz,
        ru: description_ru || banner.description.ru,
        oz: description_oz || banner.description.oz,
      };
    }

    await banner.save();

    res.status(200).json({
      message: "✅ Hujjat muvaffaqiyatli yangilandi",
      data: banner,
    });
  } catch (error) {
    console.error("❌ Yangilash xatosi:", error);
    res.status(500).json({
      message: "❌ Yangilashda xatolik yuz berdi",
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID formatini tekshirish
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Noto'g'ri ID format" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) return res.status(404).json({ message: "❌ Banner topilmadi" });

    // ✅ Faylni o'chirish
    const filePath = path.join(__dirname, "../uploads/banner", banner.file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("⚠️ Faylni o'chirishda xatolik:", err.message);
      }
    }

    await bannerModel.findByIdAndDelete(id);

    res.status(200).json({ message: "🗑️ Banner muvaffaqiyatli o'chirildi" });
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};
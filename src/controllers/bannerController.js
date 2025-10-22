const bannerModel = require("../models/bannerModel");
const fs = require("fs");
const path = require("path");

// 🟢 Banner yaratish
exports.create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Fayl yuklanmadi" });
    }

    const { title, description } = req.body;
    const mediaType = req.file.mimetype.startsWith("image") ? "image" : "video";

    const newBanner = new bannerModel({
      file: req.file.filename,
      title,
      description,
      mediaType,
    });

    await newBanner.save();
    res.status(201).json({ message: "✅ Banner yaratildi", banner: newBanner });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// 🔵 Barcha bannerlarni olish
exports.getAll = async (req, res) => {
  try {
    const banners = await bannerModel.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// 🟣 Bitta banner (ID orqali)
exports.getById = async (req, res) => {
  try {
    const banner = await bannerModel.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner topilmadi" });
    res.status(200).json(banner);
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// 🟠 Banner yangilash (faylni ham o‘zgartirish mumkin)
exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    const banner = await bannerModel.findById(req.params.id);

    if (!banner) return res.status(404).json({ message: "Banner topilmadi" });

    // Agar yangi fayl yuklansa — eski faylni o‘chir
    if (req.file) {
      try {
        fs.unlinkSync(path.join("uploads", banner.file));
      } catch (err) {
        console.warn("Old faylni o‘chirishda xatolik:", err.message);
      }

      banner.file = req.file.filename;
      banner.mediaType = req.file.mimetype.startsWith("image") ? "image" : "video";
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;

    await banner.save();

    res.status(200).json({ message: "🟠 Banner yangilandi", banner });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

// 🔴 Banner o‘chirish
exports.remove = async (req, res) => {
  try {
    const banner = await bannerModel.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner topilmadi" });

    // Faylni uploads papkasidan o‘chir
    try {
      fs.unlinkSync(path.join("uploads", banner.file));
    } catch (err) {
      console.warn("Faylni o‘chirishda xatolik:", err.message);
    }

    await bannerModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "🗑️ Banner o‘chirildi" });
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e.message });
  }
};

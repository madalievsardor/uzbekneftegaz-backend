const LocalNews = require("../models/localNewsModel");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

exports.create = async (req, res) => {
  try {
    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;

    if (!title_uz || !desc_uz) {
      return res.status(400).json({ message: "O'zbekcha title va description majburiy!" });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    const news = new LocalNews({
      title: { uz: title_uz, ru: title_ru, oz: title_oz },
      description: { uz: desc_uz, ru: desc_ru, oz: desc_oz },
      images,
    });

    await news.save();
    res.status(201).json({ message: "Yangilik muvaffaqiyatli yaratildi ✅", news });
  } catch (error) {
    console.error("❌ Xatolik (create):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const news = await LocalNews.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha local yangiliklar", news });
  } catch (error) {
    console.error("❌ Xatolik (getAll):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

// 🔍 ID ORQALI BITTA YANGILIK
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto‘g‘ri ID formati!" });
    }

    const news = await LocalNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    res.status(200).json({ message: "Yangilik topildi", news });
  } catch (error) {
    console.error("❌ Xatolik (getById):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

// ✏️ YANGILIKNI TAHRIRLASH
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto‘g‘ri ID formati!" });
    }

    const news = await LocalNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    // Yangi rasm/video fayllar qo‘shish
    let updatedImages = [...(news.images || [])];
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map((file) => file.filename);
      updatedImages = [...updatedImages, ...newFiles];
    }

    news.title.uz = title_uz || news.title.uz;
    news.title.ru = title_ru || news.title.ru;
    news.title.oz = title_oz || news.title.oz;

    news.description.uz = desc_uz || news.description.uz;
    news.description.ru = desc_ru || news.description.ru;
    news.description.oz = desc_oz || news.description.oz;

    news.images = updatedImages;

    await news.save();
    res.status(200).json({ message: "Yangilik muvaffaqiyatli yangilandi ✅", news });
  } catch (error) {
    console.error("❌ Xatolik (update):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

// 🗑️ YANGILIKNI O‘CHIRISH
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto‘g‘ri ID formati!" });
    }

    const news = await LocalNews.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    // Rasmlarni fayl tizimidan o‘chirish
    if (news.images && news.images.length > 0) {
      news.images.forEach((imgPath) => {
        const filePath = path.join(__dirname, "../uploads/localNews", imgPath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    await LocalNews.findByIdAndDelete(id);
    res.status(200).json({ message: "Yangilik muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.error("❌ Xatolik (remove):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

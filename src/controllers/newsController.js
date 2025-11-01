const News = require("../models/newsModel");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// 📰 YANGILIK YARATISH
exports.create = async (req, res) => {
  try {
    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;

    if (!title_uz || !desc_uz) {
      return res.status(400).json({ message: "O‘zbekcha title va description majburiy!" });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `uploads/news/${file.filename}`);
    }

    const news = new News({
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

// 🧾 BARCHA YANGILIKLARNI O‘QISH
exports.getAll = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha yangiliklar", news });
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

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    res.status(200).json({ message: "Yangilik topildi", news });
  } catch (error) {
    console.error("❌ Xatolik (getById):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

// ✏️ YANGILIKNI TAHRIRL
// ✏️ YANGILIKNI TAHRIRLASH
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title_uz, title_ru, title_oz, desc_uz, desc_ru, desc_oz } = req.body;

    // ID formati tekshiruvi
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto‘g‘ri ID formati!" });
    }

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    // Yangi rasm bo‘lsa — qo‘shamiz
    let updatedImages = [...(news.images || [])];
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `uploads/news/${file.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    // Ma’lumotlarni yangilash
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

    // ID formati tekshiriladi
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto‘g‘ri ID formati!" });
    }

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi!" });

    // Rasmlarni fayl tizimidan o‘chirish
    if (news.images && news.images.length > 0) {
      news.images.forEach((imgPath) => {
        const filePath = path.join(__dirname, "../", imgPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await News.findByIdAndDelete(id);

    res.status(200).json({ message: "Yangilik muvaffaqiyatli o‘chirildi ✅" });
  } catch (error) {
    console.error("❌ Xatolik (remove):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

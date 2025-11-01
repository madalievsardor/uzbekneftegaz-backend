const News = require("../models/newsModel");
const path = require("path");
const fs = require("fs");

// 📰 YANGILIK YARATISH
exports.create = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title va description majburiy!" });
    }

    // Fayllar yuklangan bo‘lsa — fayl nomlarini olish
    const images = req.files?.map((file) => file.filename) || [];

    const news = new News({
      title,
      description,
      images,
    });

    await news.save();
    res.status(201).json({
      message: "Yangilik muvaffaqiyatli yaratildi.",
      news,
    });
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
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi" });
    res.status(200).json({ message: "Yangilik topildi", news });
  } catch (error) {
    console.error("❌ Xatolik (getById):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

// ✏️ YANGILIKNI TAHRIRLASH
exports.update = async (req, res) => {
  try {
    const { title, description } = req.body;
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi" });

    // Yangi rasm yuklangan bo‘lsa — yangi fayllarni qo‘shamiz
    let updatedImages = [...(news.images || [])];
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map((file) => file.filename);
      updatedImages = [...updatedImages, ...newFiles];
    }

    news.title = title || news.title;
    news.description = description || news.description;
    news.images = updatedImages;

    await news.save();
    res.status(200).json({ message: "Yangilik yangilandi", news });
  } catch (error) {
    console.error("❌ Xatolik (update):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

// 🗑️ YANGILIKNI O‘CHIRISH
exports.remove = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi" });

    // Rasm fayllarini o‘chirish (agar mavjud bo‘lsa)
    if (news.images && news.images.length > 0) {
      news.images.forEach((img) => {
        const imgPath = path.join(__dirname, "../uploads/news", img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });
    }

    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Yangilik o‘chirildi", news });
  } catch (error) {
    console.error("❌ Xatolik (remove):", error);
    res.status(500).json({ message: "Serverda xatolik", error: error.message });
  }
};

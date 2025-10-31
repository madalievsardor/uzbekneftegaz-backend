const bannerModel = require("../models/bannerModel");
const fs = require("fs");
const path = require("path");

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
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) {
      return res.status(404).json({ message: "❌ Banner topilmadi" });
    }

    res.status(200).json({ message: "✅ Banner topildi", data: banner });
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

// 🟠 Banner yangilash (faylni ham o‘zgartirish mumkin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID formatini tekshirish
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) return res.status(404).json({ message: "❌ Banner topilmadi" });

    const {
      title_uz, title_ru, title_oz,
      desc_uz, desc_ru, desc_oz
    } = req.body;

    // ✅ Majburiy maydonni tekshirish
    if (title_uz && typeof title_uz !== "string") {
      return res.status(400).json({ message: "❌ title_uz string bo‘lishi kerak" });
    }

    // ✅ Faylni tekshirish va eski faylni o‘chirish
    if (req.file) {
      if (!req.file.mimetype.startsWith("image") && !req.file.mimetype.startsWith("video")) {
        return res.status(400).json({ message: "❌ Faqat rasm yoki video fayl yuklash mumkin" });
      }

      const oldPath = path.join(__dirname, "../uploads/banner", banner.file);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.warn("⚠️ Eski faylni o‘chirishda xatolik:", err.message);
        }
      }

      banner.file = req.file.filename;
      banner.mediaType = req.file.mimetype.startsWith("image") ? "image" : "video";
    }

    // ✅ Ma’lumotlarni yangilaymiz
    banner.title = {
      uz: title_uz || banner.title.uz,
      ru: title_ru || banner.title.ru,
      oz: title_oz || banner.title.oz
    };
    banner.description = {
      uz: desc_uz || banner.description.uz,
      ru: desc_ru || banner.description.ru,
      oz: desc_oz || banner.description.oz
    };

    await banner.save();

    res.status(200).json({ message: "✅ Banner muvaffaqiyatli yangilandi", data: banner });
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID formatini tekshirish
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });
    }

    const banner = await bannerModel.findById(id);
    if (!banner) return res.status(404).json({ message: "❌ Banner topilmadi" });

    // ✅ Faylni o‘chirish
    const filePath = path.join(__dirname, "../uploads/banner", banner.file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("⚠️ Faylni o‘chirishda xatolik:", err.message);
      }
    }

    await bannerModel.findByIdAndDelete(id);

    res.status(200).json({ message: "🗑️ Banner muvaffaqiyatli o‘chirildi" });
  } catch (e) {
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};
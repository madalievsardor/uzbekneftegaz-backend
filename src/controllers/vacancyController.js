const Bolim = require("../models/tarkibiyBolimModel");

// ➕ CREATE — yangi bo‘lim yaratish
exports.create = async (req, res) => {
  try {
    const { title, employees, leader, description } = req.body;

    // faqat uz maydonlari tekshiriladi
    if (!title?.uz || !employees?.uz || !leader?.uz) {
      return res
        .status(400)
        .json({ message: "Uzbek tilidagi (uz) maydonlar majburiy!" });
    }

    const newBolim = new Bolim({
      title,
      employees,
      leader,
      description: description || { uz: "", ru: "", oz: "" },
    });

    await newBolim.save();
    res.status(201).json({
      message: "Bo‘lim muvaffaqiyatli yaratildi",
      bolim: newBolim,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
};

// 📋 GET ALL — barcha bo‘limlarni olish
exports.getAll = async (req, res) => {
  try {
    const bolimlar = await Bolim.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha bo‘limlar", bolimlar });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
};

// 🧾 GET BY ID — ID orqali olish
exports.getById = async (req, res) => {
  try {
    const bolim = await Bolim.findById(req.params.id);
    if (!bolim) {
      return res.status(404).json({ message: "Bo‘lim topilmadi" });
    }
    res.status(200).json({ bolim });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
};

// ✏️ UPDATE — faqat kelgan maydonlarni yangilash
exports.update = async (req, res) => {
  try {
    const bolim = await Bolim.findById(req.params.id);
    if (!bolim) {
      return res.status(404).json({ message: "Bo‘lim topilmadi" });
    }

    const { title, employees, leader, description } = req.body;

    // 🔹 Har bir maydon uchun, agar kelsa — yangilaymiz, kelmasa — eski qiymatni qoldiramiz
    if (title) {
      bolim.title = { ...bolim.title, ...title };
    }
    if (employees) {
      bolim.employees = { ...bolim.employees, ...employees };
    }
    if (leader) {
      bolim.leader = { ...bolim.leader, ...leader };
    }
    if (description) {
      bolim.description = { ...bolim.description, ...description };
    }

    await bolim.save();

    res.status(200).json({
      message: "Bo‘lim muvaffaqiyatli yangilandi",
      bolim,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
};

// ❌ DELETE — ID orqali o‘chirish
exports.remove = async (req, res) => {
  try {
    const deleted = await Bolim.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Bo‘lim topilmadi" });
    }
    res.status(200).json({ message: "Bo‘lim muvaffaqiyatli o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Serverda xatolik", error: err.message });
  }
};

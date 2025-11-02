const leaderShipModel = require("../models/leaderModel");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs")
exports.create = async (req, res) => {
  try {
    const {
      fullName_uz,
      fullName_ru,
      fullName_oz,
      grade_uz,
      grade_ru,
      grade_oz,
      phone,
      email,
      avatar,
      workDays_uz,
      workDays_ru,
      workDays_oz,
      workHours_start,
      workHours_end,
      description_uz,
      description_ru,
      description_oz,
    } = req.body;

    let avatarPath = "/assets/leader.png";
    if (req.file) {
      // Fayl mavjud bo‘lsa – uploads/leaders papkaga saqlanadi
      avatarPath = `${req.file.filename}`;
      console.log("✅ Avatar yuklandi:", avatarPath);
    }

    // Majburiy maydonlar tekshiruvi
    if (
      !fullName_uz ||
      !grade_uz ||
      !phone ||
      !workDays_uz ||
      !workHours_start ||
      !workHours_end
    ) {
      return res
        .status(400)
        .json({ message: "❌ Barcha majburiy maydonlar to'ldirilishi kerak!" });
    }

    const newLeader = new leaderShipModel({
      fullName: { uz: fullName_uz, ru: fullName_ru, oz: fullName_oz },
      grade: { uz: grade_uz, ru: grade_ru, oz: grade_oz },
      phone,
      email,
      avatar: avatarPath,
      workDays: { uz: workDays_uz, ru: workDays_ru, oz: workDays_oz },
      workHours: { start: workHours_start, end: workHours_end },
      description: {
        uz: description_uz,
        ru: description_ru,
        oz: description_oz,
      },
    });

    await newLeader.save();
    res.status(201).json({ message: "✅ Rahbar muvaffaqiyatli qo‘shildi", newLeader });
  } catch (err) {
    console.error("❌ Xatolik:", err);
    res.status(500).json({ message: "Server xatosi", error: err.message });
  }
};

exports.getAllLeader = async (req, res) => {
  try {
    const leaders = await leaderShipModel.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Barcha rahbarlar", leaders });
  } catch (e) {
    console.error("❌ Ma'lumot olishda xatolik:", e);
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto'g'ri ID format" });
    }

    const leader = await leaderShipModel.findById(id);
    if (!leader)
      return res.status(404).json({ message: "Rahbar topilmadi" });

    res.status(200).json({ message: "Rahbar topildi", leader });
  } catch (e) {
    console.error("Xatolik:", e);
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Noto‘g‘ri ID format!" });
    }

    const leader = await leaderShipModel.findById(id);
    if (!leader) {
      return res.status(404).json({ message: "❌ Rahbar topilmadi!" });
    }

    // ⚙️ Inputlardan ma'lumotlarni olish
    const {
      fullName_uz,
      fullName_oz,
      fullName_ru,
      grade_uz,
      grade_oz,
      grade_ru,
      phone,
      email,
      workDays_uz,
      workDays_oz,
      workDays_ru,
      workHours_start,
      workHours_end,
      description_uz,
      description_oz,
      description_ru,
    } = req.body;

    // ✅ Rasm fayl bo‘lsa – yangisini qo‘shamiz
    if (req.file) {
      // Eski rasmni o‘chirish
      if (leader.avatar && leader.avatar !== "/assets/leader.png") {
        const oldPath = path.join(__dirname, "..", leader.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      leader.avatar = `${req.file.filename}`;
    }

    // ✅ Har bir maydonni yangilaymiz
    if (fullName_uz || fullName_oz || fullName_ru) {
      leader.fullName = { uz: fullName_uz, oz: fullName_oz, ru: fullName_ru };
    }
    if (grade_uz || grade_oz || grade_ru) {
      leader.grade = { uz: grade_uz, oz: grade_oz, ru: grade_ru };
    }
    if (phone) leader.phone = phone;
    if (email) leader.email = email;
    if (workDays_uz || workDays_oz || workDays_ru) {
      leader.workDays = { uz: workDays_uz, oz: workDays_oz, ru: workDays_ru };
    }
    if (workHours_start || workHours_end) {
      leader.workHours = { start: workHours_start, end: workHours_end };
    }
    if (description_uz || description_oz || description_ru) {
      leader.description = {
        uz: description_uz,
        oz: description_oz,
        ru: description_ru,
      };
    }

    await leader.save();

    res.status(200).json({
      message: "✅ Rahbar muvaffaqiyatli yangilandi",
      leader,
    });
  } catch (e) {
    console.error("❌ Yangilashda xatolik:", e);
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

/**
 * 🗑️ Rahbarni o‘chirish
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });
    }

    const leader = await leaderShipModel.findById(id);
    if (!leader) {
      return res.status(404).json({ message: "❌ Rahbar topilmadi" });
    }

    await leaderShipModel.findByIdAndDelete(id);
    res.status(200).json({ message: "🗑️ Rahbar muvaffaqiyatli o‘chirildi" });
  } catch (e) {
    console.error("❌ O‘chirish xatosi:", e);
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

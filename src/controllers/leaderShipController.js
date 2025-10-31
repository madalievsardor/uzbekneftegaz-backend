const leaderShipModel = require("../models/leaderModel");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    const {
      fullName,
      grade,
      phone,
      email,
      avatar,
      workDays,
      workHours,
      description,
    } = req.body;

    if (!fullName || !grade || !phone || !workDays || !workHours) {
      return res
        .status(400)
        .json({ message: "❌ Barcha majburiy maydonlar to‘ldirilishi kerak!" });
    }

    const phoneRegex = /^[\d\s+\-()]{7,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "❌ Telefon raqami noto‘g‘ri formatda!" });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "❌ Email formati noto‘g‘ri!" });
    }

    const leader = new leaderShipModel({
      fullName,
      grade,
      phone,
      email: email || "",
      avatar: avatar || "",
      workDays,
      workHours,
      description: description || "",
    });

    await leader.save();
    res.status(201).json({ message: "✅ Rahbar muvaffaqiyatli qo‘shildi", leader });
  } catch (e) {
    console.error("❌ Xatolik:", e);
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
  }
};

exports.getAllLeader = async (req, res) => {
  try {
    const leaders = await leaderShipModel.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "📋 Barcha rahbarlar", leaders });
  } catch (e) {
    console.error("❌ Ma'lumot olishda xatolik:", e);
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });
    }

    const leader = await leaderShipModel.findById(id);
    if (!leader)
      return res.status(404).json({ message: "❌ Rahbar topilmadi" });

    res.status(200).json({ message: "✅ Rahbar topildi", leader });
  } catch (e) {
    console.error("❌ Xatolik:", e);
    res.status(500).json({ message: "Server xatosi", error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ Noto‘g‘ri ID format" });
    }

    const {
      fullName,
      grade,
      phone,
      email,
      avatar,
      workDays,
      workHours,
      description,
    } = req.body;

    const leader = await leaderShipModel.findById(id);
    if (!leader) {
      return res.status(404).json({ message: "❌ Rahbar topilmadi!" });
    }

    // ✅ Yangilanishlar
    if (fullName) leader.fullName = fullName;
    if (grade) leader.grade = grade;
    if (phone) {
      const phoneRegex = /^[\d\s+\-()]{7,20}$/;
      if (!phoneRegex.test(phone)) {
        return res
          .status(400)
          .json({ message: "❌ Telefon raqami noto‘g‘ri formatda!" });
      }
      leader.phone = phone;
    }

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "❌ Email formati noto‘g‘ri!" });
      }
      leader.email = email;
    }

    if (avatar) leader.avatar = avatar;
    if (workDays) leader.workDays = workDays;
    if (workHours) leader.workHours = workHours;
    if (description) leader.description = description;

    await leader.save();

    res.status(200).json({
      message: "✅ Rahbar ma’lumotlari yangilandi",
      leader,
    });
  } catch (e) {
    console.error("❌ Yangilashda xatolik:", e);
    res.status(500).json({ message: "Serverda xatolik", error: e.message });
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

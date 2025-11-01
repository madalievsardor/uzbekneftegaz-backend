const BolimModel = require("../models/tarkibiyBolimModel");

// ✅ Yangi bo‘lim yaratish
exports.create = async (req, res) => {
    try {
        const { title, employees, leader, description } = req.body;

        if (!title || !employees || !leader) {
            return res.status(400).json({ message: "Majburiy maydonlar to‘ldirilishi kerak!" });
        }

        const bolim = new BolimModel({ title, employees, leader, description });
        await bolim.save();

        res.status(201).json({ message: "Bo‘lim muvaffaqiyatli yaratildi.", bolim });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ✅ Barcha bo‘limlarni olish
exports.getAll = async (req, res) => {
    try {
        const bolimlar = await BolimModel.find().sort({ createdAt: -1 });
        res.status(200).json({ bolimlar });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ✅ ID orqali bitta bo‘limni olish
exports.getById = async (req, res) => {
    try {
        const bolim = await BolimModel.findById(req.params.id);
        if (!bolim) {
            return res.status(404).json({ message: "Bo‘lim topilmadi." });
        }
        res.status(200).json({ bolim });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ✅ ID orqali bo‘limni yangilash
exports.update = async (req, res) => {
    try {
        const { title, employees, leader, description } = req.body;
        const bolim = await BolimModel.findById(req.params.id);

        if (!bolim) return res.status(404).json({ message: "Bo‘lim topilmadi." });

        // Faqat kelgan maydonlarni yangilash
        if (title) bolim.title = title;
        if (employees) bolim.employees = employees;
        if (leader) bolim.leader = leader;
        if (description) bolim.description = description;

        await bolim.save();

        res.status(200).json({ message: "Bo‘lim muvaffaqiyatli yangilandi.", bolim });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ✅ ID orqali bo‘limni o‘chirish
exports.remove = async (req, res) => {
    try {
        const bolim = await BolimModel.findById(req.params.id);
        if (!bolim) return res.status(404).json({ message: "Bo‘lim topilmadi." });

        await BolimModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Bo‘lim muvaffaqiyatli o‘chirildi.", bolim });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

const vacancyModel = require("../models/vacancyModel");

// Yangi vakansiya yaratish
exports.create = async (req, res) => {
    try {
        const { title, description, salary, requirements, deadline, salaryType } = req.body;

        if (
            !title?.uz || !title?.ru || !title?.oz ||
            !description?.uz || !description?.ru || !description?.oz ||
            !deadline ||
            !salaryType?.uz || !salaryType?.ru || !salaryType?.oz
        ) {
            return res.status(400).json({ message: "Barcha majburiy maydonlar to‘ldirilishi shart!" });
        }

        const vacancy = new vacancyModel({ title, description, salary, requirements, deadline, salaryType });
        await vacancy.save();

        res.status(201).json({ message: "Vakansiya muvaffaqiyatli yaratildi.", vacancy });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// Barcha vakansiyalarni olish
exports.getAll = async (req, res) => {
    try {
        const vacancies = await vacancyModel.find().sort({ createdAt: -1 });
        res.status(200).json({ vacancies });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ID orqali vakansiyani olish
exports.getById = async (req, res) => {
    try {
        const vacancy = await vacancyModel.findById(req.params.id);
        if (!vacancy) {
            return res.status(404).json({ message: "Vakansiya topilmadi." });
        }
        res.status(200).json({ vacancy });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ID orqali vakansiyani yangilash
exports.update = async (req, res) => {
    try {
        const { title, description, salary, requirements, deadline, salaryType } = req.body;
        const vacancy = await vacancyModel.findById(req.params.id);
        if (!vacancy) return res.status(404).json({ message: "Vakansiya topilmadi." });

        // Faqat kelgan maydonlarni yangilash
        if (title) vacancy.title = { ...vacancy.title, ...title };       // uz, ru, oz
        if (description) vacancy.description = { ...vacancy.description, ...description }; // uz, ru, oz
        if (salary) vacancy.salary = { ...vacancy.salary, ...salary };   // uz, ru, oz
        if (requirements) vacancy.requirements = { ...vacancy.requirements, ...requirements }; // uz, ru, oz
        if (deadline) vacancy.deadline = deadline;
        if (salaryType) vacancy.salaryType = { ...vacancy.salaryType, ...salaryType }; // uz, ru, oz

        await vacancy.save();
        res.status(200).json({ message: "Vakansiya muvaffaqiyatli yangilandi.", vacancy });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

// ID orqali vakansiyani o‘chirish
exports.remove = async (req, res) => {
    try {
        const vacancy = await vacancyModel.findById(req.params.id);
        if (!vacancy) return res.status(404).json({ message: "Vakansiya topilmadi." });

        await vacancyModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Vakansiya muvaffaqiyatli o‘chirildi.", vacancy });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Serverda xatolik", error: e.message });
    }
};

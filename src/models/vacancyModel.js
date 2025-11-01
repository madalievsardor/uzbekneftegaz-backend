const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({
    title: {
        uz: { type: String, required: true },
        ru: { type: String, required: false },
        oz: { type: String, required: false }
    },
    description: {
        uz: { type: String, required: true },
        ru: { type: String, required: false },
        oz: { type: String, required: false }
    },
    salary: {
        uz: { type: String, required: false },
        ru: { type: String, required: false },
        oz: { type: String, required: false }
    },
    requiremozts: {
        uz: { type: String, required: false },
        ru: { type: String, required: false },
        oz: { type: String, required: false }
    },
    deadline: { type: Date, required: true },
    salaryType: {
        uz: { type: String, enum: ["To‘liq stavka", "Yarim stavka"], required: true },
        ru: { type: String, enum: ["Полная ставка", "Половина ставки"], required: true },
        oz: { type: String, enum: ["Тўлиқ ставка", "Ярим ставка"], required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model("NefteGazVacancy", vacancySchema);

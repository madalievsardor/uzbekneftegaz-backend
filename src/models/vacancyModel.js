const mongoose = require("mongoose");

const vacancySchema = new mongoose.Schema({
  title: {
    uz: { type: String, required: true },
    ru: { type: String },
    oz: { type: String },
  },
  description: {
    uz: { type: String, required: true },
    ru: { type: String },
    oz: { type: String },
  },
  salary: {
    uz: { type: String },
    ru: { type: String },
    oz: { type: String },
  },
  requirements: { // ✅ to‘g‘rilandi
    uz: { type: String },
    ru: { type: String },
    oz: { type: String },
  },
  deadline: { type: Date, required: true },
  salaryType: {
    uz: {
      type: String,
      enum: ["To'liq stavka", "Yarim stavka"],
      required: true,
    },
    ru: {
      type: String,
      enum: ["Полная ставка", "Половина ставки"],
      required: true,
    },
    oz: {
      type: String,
      enum: ["Тўлиқ ставка", "Ярим ставка"],
      required: true,
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("NefteGazVacancy", vacancySchema);

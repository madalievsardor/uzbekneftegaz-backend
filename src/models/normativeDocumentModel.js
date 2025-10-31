const mongoose = require("mongoose");

const normativeDocumentSchema = new mongoose.Schema(
  {
    // 🏷️ Hujjat nomi (ko‘p tilda)
    title: {
      uz: { type: String, required: true },
      ru: { type: String },
      oz: { type: String },
    },

    // 📜 Qaror yoki farmon raqami (ko‘p tilda)
    decree: {
      uz: { type: String, required: true },
      ru: { type: String },
      oz: { type: String },
    },

    // 🧾 Tavsif (ko‘p tilda)
    description: {
      uz: { type: String, required: true },
      ru: { type: String },
      oz: { type: String },
    },

    file: { type: String, required: true },

    fileType: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("NormativeDocument", normativeDocumentSchema);

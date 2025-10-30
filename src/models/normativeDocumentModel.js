const mongoose = require("mongoose");

const normativeDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Hujjat nomi
    decree: { type: String, required: true }, // Qaror yoki farmon raqami
    description: { type: String, required: true},
    file: { type: String, required: true }, // Yuklangan fayl nomi (PDF, DOCX, ZIP va h.k.)
    fileType: { type: String, default: "application/pdf" }, // Fayl turi (mimetype)
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("NormativeDocument", normativeDocumentSchema);
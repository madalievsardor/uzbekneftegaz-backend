const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
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
    images: { type: [String] }, // bir nechta rasm
  },
  { timestamps: true }
);

module.exports = mongoose.model("NefteGazNews", newsSchema);

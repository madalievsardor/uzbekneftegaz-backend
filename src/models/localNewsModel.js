const mongoose = require("mongoose");

const localNewsSchema = new mongoose.Schema(
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

module.exports = mongoose.model("NefteGazNewsLocalNews", localNewsSchema);

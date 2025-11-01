const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String]},
  },
  { timestamps: true }
);
module.exports = mongoose.model("NefteGazNews", newsSchema);

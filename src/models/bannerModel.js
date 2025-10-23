const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        file: { type: String, required: true },
        title: {
            uz: { type: String, required: true },
            ru: { type: String, required: false },
            kr: { type: String, required: false }
        },
        description: {
            uz: { type: String, required: false },
            ru: { type: String, required: false },
            kr: { type: String, required: false }
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("NefteGazBanner", bannerSchema);
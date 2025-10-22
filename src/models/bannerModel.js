const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        file: { type: String, required: true }, 
        title: { type: String, required: false },
        description: { type: String },
        mediaType: {
            type: String,
            enum: ["image", "video"], 
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("NefteGazBanner", bannerSchema);
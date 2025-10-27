const mongoose = require("mongoose");

const leaderShipSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    grade: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: false },
    avatar: {
        type: String,
        default: "https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png"
    },
    workDays: {
        type: [String],
        required: true
    },
    workHours: {
        start: {
            type: String,
            required: true,
            match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // HH:mm format
            example: "09:00"
        },
        end: {
            type: String,
            required: true,
            match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
            example: "18:00"
        }
    },
    description: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("Leadership", leaderShipSchema);

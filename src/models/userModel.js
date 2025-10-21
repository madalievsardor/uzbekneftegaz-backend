const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true, minLength: 6},
    avatar: {type: String, required: false, default: "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"},
    phone: {type: Number, required: true, trim: true,  unique: true},
    role: { type: String, default: "admin", enum: ["admin"] }
})

module.exports = mongoose.model("NefteGazUser", userSchema)
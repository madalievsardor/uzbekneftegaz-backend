const mongoose = require("mongoose");

const tarkibiiyBolimSchema = new mongoose.Schema({
    title: { type: String, required: true},
    employees: { type: String, required: true},
    leader: { type: String, required: true},
    description: { type: String, required: false}
}, {timestamps: true})

module.exports = mongoose.model("NefteGazBolim", tarkibiiyBolimSchema)
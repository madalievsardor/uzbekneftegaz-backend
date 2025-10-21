const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const PORT = 8000

const authRoutes = require("./src/routes/authRoutes");
const connectDB = require("./src/config/db");

connectDB()
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("Server running")
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
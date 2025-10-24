const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const path = require("path");
const PORT = 8000
const authRoutes = require("./src/routes/authRoutes");
const connectDB = require("./src/config/db");
const { swaggerUi, swaggerSpec } = require("./src/config/swagger")
const bannerRoutes = require("./src/routes/bannerRoutes");

connectDB()
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));
app.get("/", (req, res) => {
    res.send("Server running")
})


app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
})
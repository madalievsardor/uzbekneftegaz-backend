const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Routes
const authRoutes = require("./src/routes/authRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");
const connectDB = require("./src/config/db");
const { swaggerUi, swaggerSpec } = require("./src/config/swagger");

// 🔹 Databasega ulanish
connectDB();

// 🔹 CORS — har qanday domen uchun ruxsat (productionda xohlasang aniq domen bilan cheklash mumkin)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 🔹 Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔹 API routes
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);

// 🔹 Statik fayllar (rasmlar uchun)
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// 🔹 Root endpoint
app.get("/", (req, res) => {
  res.send("✅ Server running");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
});

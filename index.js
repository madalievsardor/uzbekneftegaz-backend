const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8000;
const authRoutes = require("./src/routes/authRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");
const connectDB = require("./src/config/db");
const { swaggerUi, swaggerSpec } = require("./src/config/swagger");

connectDB();

// ✅ CORS sozlamasi (to‘liq ruxsat)
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local React uchun
      "https://uzbekneftegaz-backend.onrender.com", // Render API
      "https://uzbekneftegaz-frontend.onrender.com", // agar frontend ham renderda bo‘lsa
      "*", // fallback
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);

// ✅ Static fayllar (uploads)
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

app.get("/", (req, res) => {
  res.send("✅ UzbekNeftegaz Backend running successfully!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
});

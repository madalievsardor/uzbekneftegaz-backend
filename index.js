const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8000;
const connectDB = require("./src/config/db");
const { swaggerUi, swaggerSpec } = require("./src/config/swagger");
const authRoutes = require("./src/routes/authRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");

connectDB();

// ✅ Universal CORS (Render va Local uchun)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local frontend
      "http://localhost:8000", // Local API
      "https://uzbekneftegaz-backend.onrender.com", // Render backend
      "https://uzbekneftegaz-frontend.onrender.com", // agar frontend Renderda bo‘lsa
      "*",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);

// ✅ Static fayllar (uploads)
app.use("/uploads", express.static(path.join(__dirname, "src", "uploads")));

// ✅ Test route
app.get("/", (req, res) => res.send("✅ UzbekNeftegaz backend ishlayapti!"));

// ✅ Serverni ishga tushurish
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
});

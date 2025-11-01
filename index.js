const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Routes
const authRoutes = require("./src/routes/authRoutes");
const bannerRoutes = require("./src/routes/bannerRoutes");
const leaderRoutes = require("./src/routes/leaderRoutes");
const vacancyRoutes = require("./src/routes/vacancyRoutes");
const normativRoutes = require("./src/routes/normativeRoutes");
const honoraryRoutes = require("./src/routes/honoraryRoutes");
const tarkibiyBolimRoutes = require("./src/routes/tarkibiyBolimRoutes");
const newsRoutes = require("./src/routes/newsRoutes");
const localNewsRoutes = require("./src/routes/localNewsRoutes");
const industryNewsRoutes = require("./src/routes/industryNewsRoutes")
const connectDB = require("./src/config/db");
const { swaggerUi, swaggerSpec } = require("./src/config/swagger");

// DB
connectDB();

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/leader", leaderRoutes);
app.use("/api/vacancies", vacancyRoutes)
app.use("/api/normative", normativRoutes)
app.use("/api/honorary", honoraryRoutes)
app.use("/api/bolimlar", tarkibiyBolimRoutes)
app.use("/api/news", newsRoutes)
app.use("/api/localNews", localNewsRoutes)
app.use("/api/industryNews", industryNewsRoutes)
// Statik fayllar
// Statik fayllar
app.use("/uploads/banners", express.static(path.join(__dirname, "src", "uploads", "banners")));
app.use("/uploads/files", express.static(path.join(__dirname, "src", "uploads", "files")));
app.use("/uploads/news", express.static(path.join(__dirname, "src", "uploads", "news")));
app.use("/uploads/honorary", express.static(path.join(__dirname, "src", "uploads", "honorary")));
app.use("/uploads/localNews", express.static(path.join(__dirname, "src", "uploads", "localNews")));
app.use("/uploads/industryNews", express.static(path.join(__dirname, "src", "uploads", "industryNews")));
app.use("/assets", express.static(path.join(__dirname, "src/assets/images")));


// Root
app.get("/", (req, res) => {
  res.send("✅ Uzbekneftegaz Backend ishlayapti 🚀");
});

// Port
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
});

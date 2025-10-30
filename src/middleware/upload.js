const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔧 Storage sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    // 🔹 Banner fayllar
    if (req.baseUrl.includes("/banner")) {
      folderPath = path.join(__dirname, "../uploads/banners");
    }
    // 🔹 Normativ hujjatlar
    else if (req.baseUrl.includes("/normative")) {
      folderPath = path.join(__dirname, "../uploads/files");
    }
    // 🔹 Default (boshqa endpointlar)
    else {
      folderPath = path.join(__dirname, "../uploads/others");
    }

    // ✅ Papka yo‘qligini tekshirib, avtomatik yaratamiz
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log("📁 Yangi papka yaratildi:", folderPath);
    }

    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// 🔸 Ruxsat berilgan fayl turlari
const allowedTypes = [
  // 🖼 Rasmlar
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  // 🎥 Videolar
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/mpeg",
  "video/webm",
  // 📄 Hujjatlar
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "❌ Faqat rasm, video yoki hujjat (PDF, DOCX, ZIP, XLSX) fayllarni yuklash mumkin!"
      ),
      false
    );
  }
};

// ⚙️ Yakuniy upload sozlamalari
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Maksimal 50 MB
});

module.exports = upload;

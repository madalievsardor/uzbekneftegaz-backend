const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔧 Storage sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    if (req.baseUrl.includes("/news")) {
      folderPath = path.join(__dirname, "../uploads/news");
    } 
    else if (req.baseUrl.includes("/localNews")) {
      folderPath = path.join(__dirname, "../uploads/localNews");
    } 
    else if (req.baseUrl.includes("/industryNews")) {
      folderPath = path.join(__dirname, "../uploads/industryNews");
    }
    else if (req.baseUrl.includes("/banner")) {
      folderPath = path.join(__dirname, "../uploads/banners");
    } 
    else if (req.baseUrl.includes("/normative")) {
      folderPath = path.join(__dirname, "../uploads/files");
    } 
    else if (req.baseUrl.includes("/honorary")) {
      folderPath = path.join(__dirname, "../uploads/honorary");
    } 
    else if (req.baseUrl.includes("/leader")) {
      folderPath = path.join(__dirname, "../uploads/leaders");
    } 
    else {
      folderPath = path.join(__dirname, "../uploads/others");
    }

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log("📁 Yangi papka yaratildi:", folderPath);
    }

    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",

  "video/mp4",
  "video/mov",
  "video/avi",
  "video/mpeg",
  "video/webm",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Faqat rasm, video fayllarni yuklash mumkin!"), false);
};

// ⚙️ Yakuniy upload sozlamalari
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload;

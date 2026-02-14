const path = require('path');
const fs = require('fs');
const multer = require('multer');

// 🔥 Always use project root (important for Render)
const uploadPath = path.join(process.cwd(), 'uploads');

// 👉 Ensure uploads folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Allowed file types
const allowedMimes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/dicom',
];

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname) || '.jpg';

    cb(null, `xray-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPG, PNG, and DICOM are allowed.'
      ),
      false
    );
  }
};

// Multer setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;

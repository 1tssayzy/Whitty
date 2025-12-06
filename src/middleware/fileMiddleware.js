// src/middleware/fileMiddleware.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {    
    cb(null, path.join(__dirname, "../../uploads/avatars"));
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const types = ["image/png", "image/jpeg", "image/jpg"];
const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({ storage, fileFilter });
const fs = require("fs");
const multer = require("multer");

const uploadDirectory = "./upload";
const imagesPath = `${uploadDirectory}/images`;

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath);
}

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).array("images");

module.exports = upload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const updateImage = async (product, newImage, index) => {
  newImage = normalizePath(newImage);

  if (index !== undefined && product.image[index]) {
    const oldImage = product.image[index];

    if (fs.existsSync(oldImage)) {
      fs.unlinkSync(oldImage);
    }

    product.image[index] = newImage;
  } else {
    product.image.push(newImage);
  }

  await product.save();
};

const normalizePath = filePath => {
  if (!filePath.startsWith('/')) {
    filePath = '/' + filePath;
  }

  return filePath.replace(/\\/g, '/');
};

module.exports = { upload, updateImage };

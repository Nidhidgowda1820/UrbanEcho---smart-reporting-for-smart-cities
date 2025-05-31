const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'civic-platform',
    });

    console.log("Cloudinary upload successful:", result.secure_url);

    // Delete local temp file after upload
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    return null;
  }
};

module.exports = { uploadImage };
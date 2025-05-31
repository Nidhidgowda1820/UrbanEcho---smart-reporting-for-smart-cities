const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../services/cloudinary');
const prisma = require('../prismaClient');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// POST /complaints - submit a new complaint
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Received complaint submission:', { body: req.body, file: req.file });
    if (req.file) {
      console.log("Attempting to upload file:", req.file.path);
      imageUrl = await uploadImage(req.file.path);
      console.log("Image URL from Cloudinary:", imageUrl);
     }
    else {
  console.warn("No file received in req.file!");
    }
    const { issueType, description, latitude, longitude } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
    }

    const complaint = await prisma.complaint.create({
      data: {
        issueType,
        description,
        imageUrl,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status: 'pending',
      },
    });

    res.status(201).json({ complaint });
  } catch (error) {
    console.error('Error creating complaint:', error);
    console.error(error.stack);
    res.status(500).json({ error: 'Failed to create complaint', details: error.message });
  }
});

module.exports = router;
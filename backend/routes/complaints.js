const express = require('express');
const multer = require('multer');
const { uploadImage } = require('../services/cloudinary');
const prisma = require('../prismaClient');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// POST /complaints - submit a new complaint
router.post('/', upload.single('image'), async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to create complaint', details: error.message });
  }
});

module.exports = router;
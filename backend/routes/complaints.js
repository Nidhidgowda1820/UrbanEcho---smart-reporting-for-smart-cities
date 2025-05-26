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

    if (!issueType || !description) {
      return res.status(400).json({ error: 'Issue type and description are required' });
    }

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

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, error: 'Failed to create complaint', details: error.message });
  }
});

// PATCH /complaints/:id/status - update complaint status and record history
router.patch('/:id/status', async (req, res) => {
  const complaintId = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: { status },
    });

    await prisma.complaintStatusHistory.create({
      data: {
        complaintId,
        status,
      },
    });

    res.json({ success: true, complaint: updatedComplaint });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ success: false, error: 'Failed to update complaint status' });
  }
});

// GET /complaints - fetch all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: { user: true, complaintStatusHistories: true },
    });
    res.json({ success: true, complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch complaints' });
  }
});

// GET /complaints/:id - fetch a specific complaint by id
router.get('/:id', async (req, res) => {
  const complaintId = parseInt(req.params.id, 10);
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { user: true, complaintStatusHistories: true },
    });
    if (!complaint) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    res.json({ success: true, complaint });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch complaint' });
  }
});

module.exports = router;

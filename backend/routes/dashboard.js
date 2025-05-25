const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

// GET /dashboard/issues-summary
router.get('/issues-summary', async (req, res) => {
  try {
    const summary = await prisma.complaint.groupBy({
      by: ['issueType', 'status'],
      _count: { id: true },
    });

    res.json({ success: true, summary });
  } catch (error) {
    console.error('Error fetching issues summary:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch issues summary' });
  }
});

// GET /dashboard/heatmap-data
router.get('/heatmap-data', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        latitude: true,
        longitude: true,
        issueType: true,
        status: true,
      },
    });

    res.json({ success: true, complaints });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch heatmap data' });
  }
});

// GET /dashboard/submitted-reports
router.get('/submitted-reports', async (req, res) => {
  try {
    const reports = await prisma.complaint.findMany({
      select: {
        id: true,
        issueType: true,
        description: true,
        imageUrl: true,
        latitude: true,
        longitude: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching submitted reports:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch submitted reports' });
  }
});

// GET /dashboard/complaint-status-history/:id
router.get('/complaint-status-history/:id', async (req, res) => {
  const complaintId = parseInt(req.params.id, 10);

  try {
    const history = await prisma.complaintStatusHistory.findMany({
      where: { complaintId },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching complaint status history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch complaint status history' });
  }
});

module.exports = router;

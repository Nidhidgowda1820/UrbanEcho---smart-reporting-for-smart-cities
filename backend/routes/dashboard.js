const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

// GET /dashboard/issues-summary - get summary statistics of issues by type and status
router.get('/issues-summary', async (req, res) => {
  try {
    const summary = await prisma.complaint.groupBy({
      by: ['issueType', 'status'],
      _count: {
        id: true,
      },
    });
    res.json({ summary });
  } catch (error) {
    console.error('Error fetching issues summary:', error);
    res.status(500).json({ error: 'Failed to fetch issues summary' });
  }
});

// GET /dashboard/heatmap-data - get data for heatmap visualization (locations of complaints)
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
    res.json({ complaints });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ error: 'Failed to fetch heatmap data' });
  }
});

module.exports = router;

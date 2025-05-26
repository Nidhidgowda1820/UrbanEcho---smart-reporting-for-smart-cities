const express = require('express');
const router = express.Router();

// Rule-based chatbot steps for civic complaint filing
const steps = [
  "Welcome to the civic issue reporting chatbot! What type of issue would you like to report? (e.g., garbage, pothole, waterlogging, broken light)",
  "Please provide a brief description of the issue.",
  "Would you like to upload an image? (yes/no)",
  "Please provide the location coordinates or address.",
  "Thank you! Your complaint is being submitted.",
];

// POST /chatbot/next-step
router.post('/next-step', (req, res) => {
  const { stepIndex } = req.body;

  if (stepIndex === undefined || stepIndex < 0 || stepIndex >= steps.length) {
    return res.status(400).json({ success: false, error: 'Invalid step index' });
  }

  res.json({ success: true, message: steps[stepIndex] });
});

module.exports = router;

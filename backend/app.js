require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
const frontendPath = path.join(__dirname, '../../frontend-folder/frontend/frontend/public');
app.use(express.static(frontendPath));

// Import routes
const authRouter = require('./routes/auth');           // 👈 Added auth router
const complaintsRouter = require('./routes/complaints');
const chatbotRouter = require('./routes/chatbot');
const dashboardRouter = require('./routes/dashboard');

// Use routes
app.use('/auth', authRouter);                          // 👈 Mounted auth route
app.use('/complaints', complaintsRouter);
app.use('/chatbot', chatbotRouter);
app.use('/dashboard', dashboardRouter);

// Serve index.html for unmatched frontend routes (for React SPA support)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Civic platform backend is running.' });
});

const complaintsRouter = require('./routes/complaints');

const chatbotRouter = require('./routes/chatbot');

const dashboardRouter = require('./routes/dashboard');

app.use('/complaints', complaintsRouter);
app.use('/chatbot', chatbotRouter);
app.use('/dashboard', dashboardRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

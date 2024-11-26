const express = require('express');
const colors = require('colors');
const moragan = require('morgan');
const connectDB = require('./config/db');
require('dotenv').config();

// Import CORS
const cors = require('cors');

// MongoDB connection
connectDB();

// Create an Express app
const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Update this to match your frontend's URL
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ['Content-Type', 'Authorization'],  // Limit headers to the necessary ones
}));

// Middleware for limiting request body size
app.use(express.json({ limit: '10kb' }));  // Adjust body size limit as needed
app.use(express.urlencoded({ extended: true, limit: '10kb' }));  // For form submissions

// Logging middleware
app.use(moragan('dev'));

// Routes
app.use('/api/v1/user', require('./routes/userRoutes'));

// Default route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_MODE || 'development'} mode on port ${port}`);
});

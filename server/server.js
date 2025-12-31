// Express server bootstrap: wires middleware, DB, and routes
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for local dev and client usage
app.use(express.json()); // Parse JSON bodies

// Database connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to Database!'))
    .catch((err) => console.log('Connection Failed:', err));

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
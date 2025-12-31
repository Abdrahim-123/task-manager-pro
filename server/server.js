require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- 1. IMPORT CORS

const app = express();

// MIDDLEWARE
app.use(cors()); // <--- 2. USE CORS (Must be at the top!)
app.use(express.json());

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to Database!"))
    .catch((err) => console.log("Connection Failed:", err));

// ROUTES
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// START SERVER
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
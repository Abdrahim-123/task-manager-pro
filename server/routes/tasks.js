const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user ID to request
    next();
    } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
    }
};

// Get all tasks
router.get('/', auth, async (req, res) => {
    try {
    // Fetch tasks for current user
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// Create task
router.post('/', auth, async (req, res) => {
    try {
    const { title, description } = req.body;
    const newTask = new Task({
        title,
        description,
        userId: req.user.id
    });
    const savedTask = await newTask.save();
    res.json(savedTask);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// Update task
router.put('/:id', auth, async (req, res) => {
    try {
    const { title, description, status } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id }, // Ensure task belongs to user
        { title, description, status },
        { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

module.exports = router;    
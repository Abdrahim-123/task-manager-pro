const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// MIDDLEWARE: Check if user is logged in
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user ID to the request
    next();
    } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
    }
};

// 1. GET ALL TASKS (Read)
router.get('/', auth, async (req, res) => {
    try {
    // Only fetch tasks that belong to the logged-in user
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// 2. CREATE A TASK (Create)
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

// 3. UPDATE TASK (Update)
router.put('/:id', auth, async (req, res) => {
    try {
    const { title, description, status } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id }, // Ensure user owns the task
        { title, description, status },
        { new: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// 4. DELETE TASK (Delete)
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
const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

// =============================
// AUTHENTICATION MIDDLEWARE
// =============================
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
}

// =============================
// GET ALL TASKS (with filters)
// =============================
router.get('/', authenticate, async (req, res) => {
  try {
    const { priority, overdue } = req.query;
    const query = { userId: req.userId };

    if (priority) query.priority = priority;
    if (overdue === 'true') query.dueDate = { $lt: new Date() };

    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// =============================
// CREATE NEW TASK
// =============================
router.post('/', authenticate, async (req, res) => {
  try {
    const validPriorities = ['High', 'Medium', 'Low'];
    const { title, dueDate, priority } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const task = new Task({
      title,
      dueDate,
      priority: priority || 'Medium',
      userId: req.userId
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

// =============================
// UPDATE TASK
// =============================
router.put('/:id', authenticate, async (req, res) => {
  try {
    const validPriorities = ['High', 'Medium', 'Low'];
    const updateData = { ...req.body };

    if (updateData.priority && !validPriorities.includes(updateData.priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update task' });
  }
});

// =============================
// DELETE TASK
// =============================
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
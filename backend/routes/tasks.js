const express = require('express');
const router = express.Router();
const { Task, User } = require('../models');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid/expired token' });
  }
};

// Get task statistics for dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get current date boundaries
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    // Query tasks created by this user (CA)
    const query = { createdBy: userId };
    
    // Get all tasks
    const allTasks = await Task.find(query);
    
    // Calculate statistics
    const totalTasks = allTasks.length;
    
    const dueToday = allTasks.filter(task => 
      task.status !== 'completed' && 
      task.dueDate >= today && 
      task.dueDate < tomorrow
    ).length;
    
    const inProgress = allTasks.filter(task => 
      task.status === 'in-progress'
    ).length;
    
    const overdue = allTasks.filter(task => 
      task.status !== 'completed' && 
      task.dueDate < today
    ).length;
    
    const tasksThisWeek = allTasks.filter(task => 
      task.createdAt >= startOfWeek && 
      task.createdAt < endOfWeek
    ).length;
    
    const stats = {
      totalTasks,
      tasksThisWeek,
      dueToday,
      inProgress,
      inProgressPercentage: totalTasks > 0 ? ((inProgress / totalTasks) * 100).toFixed(1) : '0',
      overdue
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching task statistics', 
      error: error.message 
    });
  }
});

// Get all tasks with filters
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, taskType, dueDate, client } = req.query;
    
    // Base query - tasks created by this user
    const query = { createdBy: userId };
    
    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (taskType && taskType !== 'all') {
      query.taskType = taskType;
    }
    
    if (client) {
      query.client = client;
    }
    
    // Due date filters
    if (dueDate) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (dueDate === 'today') {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query.dueDate = { $gte: today, $lt: tomorrow };
      } else if (dueDate === 'week') {
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + 7);
        query.dueDate = { $gte: today, $lt: endOfWeek };
      } else if (dueDate === 'month') {
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        query.dueDate = { $gte: today, $lte: endOfMonth };
      } else if (dueDate === 'overdue') {
        query.dueDate = { $lt: today };
        query.status = { $ne: 'completed' };
      }
    }
    
    const tasks = await Task.find(query)
      .populate('client', 'name businessName email')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 })
      .lean();
    
    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching tasks', 
      error: error.message 
    });
  }
});

// Get single task by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    })
      .populate('client', 'name businessName email phone gstin')
      .populate('assignedTo', 'name email phone')
      .populate('createdBy', 'name email');
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    res.json({ success: true, task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching task', 
      error: error.message 
    });
  }
});

// Create new task
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      client,
      assignedTo,
      status,
      priority,
      taskType,
      startDate,
      dueDate,
      tags,
      notes
    } = req.body;
    
    // Validate required fields
    if (!title || !client || !assignedTo || !taskType || !dueDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: title, client, assignedTo, taskType, dueDate' 
      });
    }
    
    // Get client and assignee names
    const clientUser = await User.findById(client);
    const assignedUser = await User.findById(assignedTo);
    
    if (!clientUser || !assignedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Client or assigned user not found' 
      });
    }
    
    // Create task
    const task = await Task.create({
      title,
      description,
      client,
      clientName: clientUser.businessName || clientUser.name,
      assignedTo,
      assignedToName: assignedUser.name,
      createdBy: userId,
      status: status || 'pending',
      priority: priority || 'medium',
      taskType,
      startDate: startDate ? new Date(startDate) : new Date(),
      dueDate: new Date(dueDate),
      tags: tags || [],
      notes
    });
    
    const populatedTask = await Task.findById(task._id)
      .populate('client', 'name businessName email')
      .populate('assignedTo', 'name email');
    
    res.status(201).json({ 
      success: true, 
      message: 'Task created successfully', 
      task: populatedTask 
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating task', 
      error: error.message 
    });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    // Update fields
    const updates = req.body;
    
    // If client or assignedTo is being updated, update the denormalized names
    if (updates.client) {
      const clientUser = await User.findById(updates.client);
      if (clientUser) {
        updates.clientName = clientUser.businessName || clientUser.name;
      }
    }
    
    if (updates.assignedTo) {
      const assignedUser = await User.findById(updates.assignedTo);
      if (assignedUser) {
        updates.assignedToName = assignedUser.name;
      }
    }
    
    // If status is being set to completed, set completedDate
    if (updates.status === 'completed' && task.status !== 'completed') {
      updates.completedDate = new Date();
    }
    
    Object.assign(task, updates);
    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('client', 'name businessName email')
      .populate('assignedTo', 'name email');
    
    res.json({ 
      success: true, 
      message: 'Task updated successfully', 
      task: populatedTask 
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating task', 
      error: error.message 
    });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting task', 
      error: error.message 
    });
  }
});

module.exports = router;

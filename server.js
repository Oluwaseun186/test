// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files (like HTML, CSS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/todoapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
    title: String,
    completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Add a new task
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a task
app.patch('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

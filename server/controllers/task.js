const Task = require('../models/task');
const Project = require('../models/project');

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo');
        return res.json({ task: task, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const getTasksByProjectId = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id }).populate('assignedTo');
        return res.json({ tasks: tasks, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const getTasksByUserId = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.params.id }).populate('assignedTo');
        return res.json({ tasks: tasks, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const getTasksByUserIdAndProjectId = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.params.userId, project: req.params.projectId }).populate('assignedTo');
        return res.json({ tasks: tasks, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        return res.json({ task: task, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" })
    }
}

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("project");
        if (!task) return res.status(404).json({ message: "Task not found", status: "error" });
        if (task.assignedTo !== req.user._id && task.project.managers.indexOf(req.user._id) === -1) return res.status(401).json({ message: "You are not authorized to update this task", status: "error" });
        task.set(req.body);
        await task.save();
        return res.json({ task: task, status: "success" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("project");
        if (!task) return res.status(404).json({ message: "Task not found", status: "error" });
        if (task.project.managers.indexOf(req.user._id) === -1) return res.status(401).json({ message: "You are not authorized to delete this task", status: "error" });
        await task.remove();
        return res.json({ status: "success" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

module.exports = {
    getTaskById,
    getTasksByProjectId,
    getTasksByUserId,
    getTasksByUserIdAndProjectId,
    createTask,
    updateTask,
    deleteTask
}
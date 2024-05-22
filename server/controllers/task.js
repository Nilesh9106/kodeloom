const Task = require('../models/task');
const Project = require('../models/project');
const httpCode = require('../constants/httpCode');

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo');
        return res.json({ task: task });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const getTasksByProjectId = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id }).populate('assignedTo');
        return res.json({ tasks: tasks });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const getTasksByUserId = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.params.id }).populate('assignedTo');
        return res.json({ tasks: tasks });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const getTasksByUserIdAndProjectId = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.params.userId, project: req.params.projectId }).populate('assignedTo');
        return res.json({ tasks: tasks });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        return res.json({ task: task });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message })
    }
}

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("project");
        if (!task) return res.status(httpCode.NotFound).json({ message: "Task not found" });
        if (task.assignedTo !== req.user._id && task.project.managers.indexOf(req.user._id) === -1) return res.status(httpCode.Unauthorized).json({ message: "You are not authorized to update this task" });
        task.set(req.body);
        await task.save();
        return res.json({ task: task });
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate("project");
        if (!task) return res.status(httpCode.NotFound).json({ message: "Task not found "});
        if (task.project.managers.indexOf(req.user._id) === -1) return res.status(httpCode.Unauthorized).json({ message: "You are not authorized to delete this task "});
        await task.remove();
        return res.json({message: "Task deleted successfully"});
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
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
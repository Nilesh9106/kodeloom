const Task = require('../models/task');
const Project = require('../models/project');
const User = require('../models/user');
const { sendTaskAssignMail } = require('../utils/mailer');
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
        const task =await (await Task.create(req.body)).populate("assignedTo project");
        if(task.assignedTo){
            console.log("sending mail for task assign");
            await sendTaskAssignMail(task.assignedTo.email,task)
        }
        return res.json({ task: task });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message })
    }
}

const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id).populate("project");
        if (!task) return res.status(httpCode.NotFound).json({ message: "Task not found" });
        if (!task.project.members.find(u=>u.toString() == req.user._id.toString()) && !task.project.managers.find(u=>u.toString() == req.user._id.toString())) return res.status(httpCode.BadRequest).json({ message: "You are not authorized to update this task" });
        const oldAssignedTo = task.assignedTo;
        task.set(req.body);
        task= await (await task.save()).populate("assignedTo");
        if(req.body.assignedTo && oldAssignedTo?.toString() !== req.body.assignedTo.toString()){
            console.log("sending mail for task assign");
            await sendTaskAssignMail(task.assignedTo.email,task)
        }
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
        if (task.project.managers.indexOf(req.user._id) === -1) return res.status(httpCode.BadRequest).json({ message: "You are not authorized to delete this task "});
        await task.deleteOne();
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
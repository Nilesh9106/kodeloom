const Project = require('../models/project');

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('members').populate('managers');
        return res.json({ project: project, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const getProjectsByUserId = async (req, res) => {
    try {
        const projects = await Project.find({ $or: [{ members: req.params.id }, { managers: req.params.id }] });
        return res.json({ projects: projects, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const createProject = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        return res.json({ project: project, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found", status: "error" });
        if (project.managers.indexOf(req.user._id) === -1) return res.status(401).json({ message: "You are not authorized to update this project", status: "error" });

        project.set(req.body);
        await project.save();
        return res.json({ project: project, status: "success" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found", status: "error" });
        if (project.managers.indexOf(req.user._id) === -1) return res.status(401).json({ message: "You are not authorized to delete this project", status: "error" });
        await project.remove();
        return res.json({ status: "success" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

module.exports = {
    getProjectById,
    getProjectsByUserId,
    createProject,
    updateProject,
    deleteProject,
}
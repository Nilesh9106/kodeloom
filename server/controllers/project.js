const Project = require('../models/project');
const httpCode = require('../constants/httpCode');

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('members').populate('managers createdBy');
        return res.json({ project: project });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const getProjectsByUserId = async (req, res) => {
    try {
        const projects = await Project.find({ $or: [{ members: req.params.id }, { managers: req.params.id }] }).populate('members').populate('managers createdBy');
        return res.json({ projects: projects});
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const createProject = async (req, res) => {
    try {
        let project = (await Project.create(req.body));
        project = await Project.findById(project._id).populate('members').populate('managers createdBy');
        return res.json({ project: project});
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(httpCode.NotFound).json({ message: "Project not found" });
        if (project.managers.indexOf(req.user._id) === -1) return res.status(httpCode.BadRequest).json({ message: "You are not authorized to update this project",  });

        project.set(req.body);
        await project.save();
        return res.json({ project: project });
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(httpCode.NotFound).json({ message: "Project not found" });
        if (project.managers.indexOf(req.user._id) === -1) return res.status(httpCode.Unauthorized).json({ message: "You are not authorized to delete this project" });
        await project.remove();
        return res.json({ message: "Project deleted successfully"});
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message});
    }
}

const addMember = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(httpCode.NotFound).json({ message: "Project not found" });
        if (project.managers.find(u=>u._id.toString() == req.user._id.toString()) === -1) return res.status(httpCode.Unauthorized).json({ message: "You are not authorized to delete this project",  });

        if (project.managers.find(u=>u._id.toString() == req.body.userId) || project.members.find(u=>u._id.toString() == req.body.userId) ) {
            project = await Project.findById(req.params.id).populate("members managers createdBy");
            console.log("already a member");
            return res.json({ project: project })
        }
        if (req.body.role == "member") {
            project.members.push(req.body.userId);
        } else {
            project.managers.push(req.body.userId);
        }
        console.log("added");
        await project.save();
        project = await Project.findById(req.params.id).populate("members managers createdBy");
        return res.json({ project: project });
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}
const removeMember = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(httpCode.NotFound).json({ message: "Project not found", });
        if (!project.managers.find(u=>u._id.toString() == req.user._id) && req.body.userId !== req.user._id.toString())
            return res.status(httpCode.Unauthorized).json({ message: "You are not authorized to delete this member",  });
        if(req.body.userId == project.createdBy.toString()){
            return res.status(httpCode.BadRequest).json({ message: "You can't remove the creator of the project",  });
        }

        if (!project.managers.find(u=>u._id.toString() == req.body.userId) && !project.members.find(u=>u._id.toString() == req.body.userId)) {
            project = await Project.findById(req.params.id).populate("members managers createdBy");
            return res.json({ project: project,  })
        }
        if (req.body.role == "member") {
            project.members = project.members.filter(member => member.toString() !== req.body.userId);
        } else {
            project.managers = project.managers.filter(manager => manager.toString() !== req.body.userId);
        }
        await project.save();
        project = await Project.findById(req.params.id).populate("members managers createdBy");
        return res.json({ project: project,  });
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message,  });
    }
}

const makeManager = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(httpCode.NotFound).json({ message: "Project not found",  });
        if(req.user._id.toString() != project.createdBy.toString()){
            return res.status(httpCode.Unauthorized).json({ message: "Only Project creator can make manager" });
        }
        if (project.managers.find(u=>u._id.toString() == req.body.userId)) {
            project = await Project.findById(req.params.id).populate("members managers createdBy");
            return res.json({ project: project,  })
        }
        project.members = project.members.filter(member => member.toString() !== req.body.userId);
        
        project.managers.push(req.body.userId);
        await project.save();
        project = await Project.findById(req.params.id).populate("members managers createdBy");
        return res.json({ project: project,  });
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message,  });
    }
}

const removeManager = async (req,res)=>{
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(httpCode.NotFound).json({ message: "Project not found",  });
        if(req.user._id.toString() != project.createdBy.toString()){
            return res.status(httpCode.Unauthorized).json({ message: "Only Project creator can remove manager" });
        }
        if (!project.managers.find(u=>u._id.toString() == req.body.userId)) {
            project = await Project.findById(req.params.id).populate("members managers createdBy");
            return res.json({ project: project,  })
        }
        project.managers = project.managers.filter(manager => manager.toString() !== req.body.userId);
        if(!project.managers.find(u=>u._id.toString() == req.body.userId)){
            project.members.push(req.body.userId);
        }
        await project.save();
        project = await Project.findById(req.params.id).populate("members managers createdBy");
        return res.json({ project: project,  });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message,  });
    }
}

module.exports = {
    getProjectById,
    getProjectsByUserId,
    createProject,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
    makeManager,
    removeManager
}
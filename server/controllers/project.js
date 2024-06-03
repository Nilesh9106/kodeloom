const Project = require('../models/project');
const Task = require('../models/task');
const Invite = require('../models/invite');
const httpCode = require('../constants/httpCode');
const { sendInviteMail } = require('../utils/mailer');

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
        // remove duplicate labels
        let labels = req.body.labels ?? [];
        let uniqueLabels = [];
        let uniqueLabelNames = [];
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            if (!uniqueLabelNames.includes(label.name)) {
                uniqueLabels.push(label);
                uniqueLabelNames.push(label.name);
            }
        }
        req.body.labels = uniqueLabels;
        console.log(req.body.labels);
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
        if (!project.managers.find(u=>u._id.toString()==req.user._id.toString())) return res.status(httpCode.BadRequest).json({ message: "Only manager of the project can update project",  });

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
        if (project.createdBy.toString() != req.user._id.toString()) return res.status(httpCode.BadRequest).json({ message: "Only Creator of Project can delete Project" });
        await Task.deleteMany({ project: project._id });
        await project.deleteOne();
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
        if (!project.managers.find(u=>u._id.toString() == req.user._id.toString())) return res.status(httpCode.BadRequest).json({ message: "You are not authorized to delete this project",  });

        if (project.managers.find(u=>u._id.toString() == req.body.userId) || project.members.find(u=>u._id.toString() == req.body.userId) ) {
            project = await Project.findById(req.params.id).populate("members managers createdBy");
            return res.json({ project: project })
        }
        let invite = await Invite.findOne({ project: req.params.id, user: req.body.userId });
        if (invite) return res.status(httpCode.BadRequest).json({ message: "Invite already sent" });
        invite =await (await Invite.create({
            project: req.params.id,
            user: req.body.userId,
            role: req.body.role
        })).populate("project user");
        if(invite){
            await sendInviteMail(invite.user.email,invite.project,invite.role);
        }
        project = await project.populate("members managers createdBy");
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
            return res.status(httpCode.BadRequest).json({ message: "You are not authorized to delete this member",  });
        if(req.body.userId == project.createdBy.toString()){
            return res.status(httpCode.BadRequest).json({ message: "You can't remove the creator of the project",  });
        }
        project = await Project.findByIdAndUpdate(req.params.id,{$pull: {members:req.body.userId,managers:req.body.userId}},{new:true}).populate("members managers createdBy");
        await Task.updateMany({project:req.params.id,assignedTo: req.body.userId}, {assignedTo: null} );
        return res.json({ project: project });
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
            return res.status(httpCode.BadRequest).json({ message: "Only Project creator can make manager" });
        }
        project = await Project.findByIdAndUpdate(req.params.id, {$addToSet: {managers: req.body.userId}, $pull: {members: req.body.userId}},{new:true}).populate("members managers createdBy");
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
            return res.status(httpCode.BadRequest).json({ message: "Only Project creator can remove manager" });
        }
        project = await Project.findByIdAndUpdate(req.params.id, {$pull: {managers: req.body.userId}, $addToSet: {members: req.body.userId}},{new:true}).populate("members managers createdBy");
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
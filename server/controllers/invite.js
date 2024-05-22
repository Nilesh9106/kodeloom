const Invite = require('../models/invite');
const Project = require('../models/project');
const httpCode = require('../constants/httpCode');

const getInvitesByUserId = async (req, res) => {
    try {
        const invites = await Invite.find({ user: req.params.userId }).populate('project user');
        return res.json({ invites: invites });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const getInvitesByProjectId = async (req, res) => {
    try {
        const invites = await Invite.find({ project: req.params.projectId }).populate('project user');
        return res.json({ invites: invites });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const acceptInvite = async (req, res) => {
    try {
        const invite = await Invite.findById(req.params.id);
        if (!invite) return res.status(httpCode.NotFound).json({ message: "Invite not found" });
        if (invite.user.toString() != req.user._id.toString()) return res.status(httpCode.BadRequest).json({ message: "Only user can accept invite" });
        let project;
        if(invite.role == "manager") {
            project = await Project.findByIdAndUpdate(invite.project, { $addToSet: { managers: invite.user }, $pull: { members: invite.user } }, { new: true }).populate("members managers createdBy");
        }else{
            project = await Project.findByIdAndUpdate(invite.project, { $addToSet: { members: invite.user }, $pull: { managers: invite.user } }, { new: true }).populate("members managers createdBy");
        }
        await invite.deleteOne();
        const invites = await Invite.find({user: invite.user}).populate('project user');
        return res.json({ project: project,invites: invites});
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const rejectInvite = async (req, res) => {
    try {
        const invite = await Invite.findById(req.params.id);
        if (!invite) return res.status(httpCode.NotFound).json({ message: "Invite not found" });
        if (invite.user.toString() != req.user._id.toString()) return res.status(httpCode.BadRequest).json({ message: "Only user can reject invite" });
        await invite.deleteOne();
        const invites = await Invite.find({user: invite.user}).populate('project user');
        return res.json({ invites: invites});
    }
    catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

module.exports = {
    getInvitesByUserId,
    getInvitesByProjectId,
    acceptInvite,
    rejectInvite
}
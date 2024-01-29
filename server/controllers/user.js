const dotenv = require('dotenv');
const User = require('../models/user');
dotenv.config();

const searchUser = async (req, res) => {
    try {
        if (!req.query.username) {
            const users = await User.find().select('-password');
            return res.json({ users: users, status: "success" });
        }
        const users = await User.find({ username: { $regex: req.query.username } }).select('-password');
        return res.json({ users: users, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        return res.json({ user: user, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const updateUser = async (req, res) => {
    try {
        if (req.params.id !== req.user._id) return res.status(401).json({ message: "You can only update your account" });
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        return res.json({ user: user, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        if (req.params.id !== req.user._id) return res.status(401).json({ message: "You can only delete your account" });
        const user = await User.findByIdAndDelete(req.params.id);
        return res.json({ user: user, status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message, status: "error" });
    }
}


module.exports = {
    searchUser,
    getUserByUsername,
    updateUser,
    deleteUser,
}
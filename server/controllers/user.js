const dotenv = require('dotenv');
const User = require('../models/user');
const httpCode = require('../constants/httpCode');
dotenv.config();

const searchUser = async (req, res) => {
    try {
        if (!req.query.username) {
            const users = await User.find().select('-password');
            return res.status(httpCode.OK).json({ users: users});
        }
        const users = await User.find({ username: { $regex: req.query.username } }).select('-password');
        return res.status(httpCode.OK).json({ users: users });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        return res.json({ user: user });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        if (req.params.id !== req.user._id.toString()) return res.status(httpCode.Unauthorized).json({ message: "You can only update your account" });
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        return res.json({ user: user });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        if (req.params.id !== req.user._id.toString()) return res.status(httpCode.Unauthorized).json({ message: "You can only delete your account" });
        const user = await User.findByIdAndDelete(req.params.id);
        return res.json({ user: user });
    } catch (error) {
        console.log(error);
        return res.status(httpCode.InternalServerError).json({ message: error.message });
    }
}


module.exports = {
    searchUser,
    getUserByUsername,
    updateUser,
    deleteUser,
}
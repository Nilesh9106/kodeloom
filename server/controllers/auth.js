const dotenv = require('dotenv');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
dotenv.config();

const login = async (request, response) => {
    try {
        const user = await User.findOne({ username: request.body.username });
        if (!user) {
            return response.status(404).json({
                status: "error",
                message: 'user not found',
            });
        }
        const isMatch = await user.verify(request.body.password);
        if (!isMatch) {
            return response.status(400).json({
                status: "error",
                message: 'wrong password',
            });
        }
        const token = generateToken(user._id);
        response.status(200).json({
            status: 'success',
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        response.status(400).json({
            status: "error",
            message: 'something went wrong',
        });
    }
};

const register = async (request, response) => {
    try {
        const userExists = await User.findOne({ $or: [{ username: request.body.username }, { email: request.body.email }] });
        if (userExists) {
            return response.status(400).json({
                status: "error",
                message: 'username or email already exists',
            });
        }

        const user = await User.create(request.body);
        const token = generateToken(user._id);
        response.status(201).json({
            status: 'success',
            user,
            token,
        });
    } catch (error) {
        response.status(400).json({
            status: "error",
            message: 'something went wrong',
        });
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = {
    login,
    register,
};
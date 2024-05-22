const dotenv = require('dotenv');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const httpCode = require('../constants/httpCode');
dotenv.config();

const login = async (request, response) => {
    try {
        const user = await User.findOne({ username: request.body.username });
        if (!user) {
            return response.status(httpCode.NotFound).json({
                message: 'user not found',
            });
        }
        const isMatch = await user.verify(request.body.password);
        if (!isMatch) {
            return response.status(httpCode.BadRequest).json({
                message: 'wrong password',
            });
        }
        const token = generateToken(user._id);
        response.status(httpCode.OK).json({
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        response.status(httpCode.InternalServerError).json({
            message: 'something went wrong',
        });
    }
};

const register = async (request, response) => {
    try {
        const userExists = await User.findOne({ $or: [{ username: request.body.username }, { email: request.body.email }] });
        if (userExists) {
            return response.status(httpCode.BadRequest).json({
                message: 'username or email already exists',
            });
        }

        const user = await User.create(request.body);
        const token = generateToken(user._id);
        response.status(httpCode.Created).json({
            user,
            token,
        });
    } catch (error) {
        response.status(httpCode.InternalServerError).json({
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
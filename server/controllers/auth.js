const dotenv = require('dotenv');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const httpCode = require('../constants/httpCode');
const { sendVerificationMail } = require('../utils/mailer');
dotenv.config();

const login = async (request, response) => {
    try {
        const username = request.body.username.toLowerCase().trim();
        const user = await User.findOne({ username:  username});
        if (!user) {
            return response.status(httpCode.NotFound).json({
                message: 'user not found',
            });
        }
        if(!user.emailVerified){
            return response.status(httpCode.BadRequest).json({
                message: 'email not verified',
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
        const email = request.body.email.toLowerCase().trim();
        const username = request.body.username.toLowerCase().trim();
        const userExists = await User.findOne({ $or: [{ username: request.body.username }, { email: request.body.email }] });
        if (userExists) {
            return response.status(httpCode.BadRequest).json({
                message: 'username or email already exists',
            });
        }

        const emailToken = generateRandomToken(40);
        const user = await User.create({...request.body,emailToken});
        if(!user){
            return response.status(httpCode.BadRequest).json({
                message: 'User not created',
            });
        }
        await sendVerificationMail(user.email, emailToken);
        response.status(httpCode.Created).json({
            user
        });
    } catch (error) {
        console.log(error);
        response.status(httpCode.InternalServerError).json({
            message: 'something went wrong',
        });
    }
};


// api/auth/verify/:token
const verifyEmail = async (req,res) => {
    try {
        const user = await User.findOne({emailToken:req.params.token});
        if(!user){
            return res.status(httpCode.BadRequest).json({
                message: 'Invalid token',
            });
        }
        user.emailVerified = true;

        await user.save();
        res.status(httpCode.OK).json({
            message: 'Email verified successfully',
        });
    } catch (error) {
        console.log(error);
        response.status(httpCode.InternalServerError).json({
            message: 'something went wrong',
        });
    }
}

function generateRandomToken(length = 20) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = {
    login,
    register,
    verifyEmail
};
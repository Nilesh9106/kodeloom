const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();


module.exports = async (request, response, next) => {
    try {
        if (request.headers && request.headers.authorization) {
            const decodedToken = jwt.verify(request.headers.authorization, process.env.JWT_SECRET);
            request.user = await User.findById(decodedToken.id);
            next();
        } else {
            response.status(401).json({
                message: "you are not authorized"
            })
        }
    } catch (error) {
        response.status(401).json({
            message: "you are not authorized!",
        });
    }
};
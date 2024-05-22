const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();


module.exports = async (request, response, next) => {
    try {
        // console.log(request.headers.authorization)
        if (request.headers && request.headers.authorization) {
            const token = request.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            request.user = await User.findById(decodedToken.id);
            // console.log("auth middleware", request.user);
            console.log("Authenticated");
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
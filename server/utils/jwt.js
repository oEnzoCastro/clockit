const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

const ACCESS_EXPIRES= "7d";

const jwtService = {
    generateAccessToken(userId) {
        return jwt.sign(
            { sub: userId },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_EXPIRES }
        );
    },


    verifyAccessToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    },

};

module.exports = jwtService;

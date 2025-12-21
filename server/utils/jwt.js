const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const Institute = require("../models/institute");

const ACCESS_EXPIRES = "7d";

const jwtService = {
    generateAccessToken(id,institute_role) {
        return jwt.sign(
            {
                id: id,
                institute_role:institute_role,
            },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_EXPIRES }
        );
    },


    verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error("Token verification failed:", error.message);
            throw error; 
        }
    }




};

module.exports = jwtService;

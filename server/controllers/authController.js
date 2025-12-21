const UserDAO = require("../DAO/userDAO");
const bcrypt = require('bcrypt');
const jwtService = require("../utils/jwt");
const UserToken = require("../models/userToken");
const UserTokenDAO = require("../DAO/userTokenDAO");
const db = require('../database/db');
const InstituteDAO = require("../DAO/instituteDAO");


const userDAO = new UserDAO(db);
const userTokenDAO = new UserTokenDAO(db);
const instituteDAO = new InstituteDAO(db);

exports.login = async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, password ,institute_name,institute_acronym} = req.body;
        let institute = null; 
        if(institute_name){
            institute = await instituteDAO.getInstitutebyName(institute_name);
        }

        if(institute_acronym){
            institute = await instituteDAO.getInstitutebyName(institute_acronym);
        }
        if (!user) {
            return res.status(404).json({
                message: "Institute Does not Exist",
                success: false
            });
        }


        const user = await userDAO.getUserByEmail(email,institute_name.institute_id);
        if (!user) {
            return res.status(404).json({
                message: "User Does not Exist",
                success: false
            });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid Password",
                success: false
            });
        }

        const token = jwtService.generateAccessToken(user.id);

        userTokenDAO.create(new UserToken({ user_id: user.id, token }));
        return res.status(200).json({
            message: "Login successful",
            token,
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            success: true
        });



    } catch (error) {
        return res.status(500).json({
            message: "Error In login",
            success: false
        });
    }
}

exports.logout = async (req, res, next) => {
    try {
        const { token } = req.body;
        const revoked = await userTokenDAO.invalidate(token);
        if (!revoked) {
            res.status(500).send('Failed to revoke token');
        }
        res.status(200).send('Token sucessfully revoked');
    } catch (error) {
        return res.status(500).send("Error in lOGOUT: " + error);
    }
}




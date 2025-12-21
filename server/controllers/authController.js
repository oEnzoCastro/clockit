const UserDAO = require("../DAO/userDAO");
const bcrypt = require('bcrypt');
const jwtService = require("../utils/jwt");
const UserToken = require("../models/userToken");
const UserTokenDAO = require("../DAO/userTokenDAO");
const db = require('../database/db');
const InstituteDAO = require("../DAO/instituteDAO");
const AreaDAO = require("../DAO/areaDAO");


const userDAO = new UserDAO(db);
const areaDAO = new AreaDAO(db);
const userTokenDAO = new UserTokenDAO(db);
const instituteDAO = new InstituteDAO(db);

exports.login = async (req, res) => {
    try {
        const { email, password, institute_name, institute_acronym } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: null,
                message: "Email and password are required"
            });
        }

        let institute = null;

        if (institute_name) {
            institute = await instituteDAO.getInstitutebyName(institute_name);
        } else if (institute_acronym) {
            institute = await instituteDAO.getInstitutebyAcronym(institute_acronym);
        }

        if (!institute) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "Institute does not exist"
            });
        }

        const user = await userDAO.getUserByEmail(email, institute.id);

        if (!user || !user.password) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "User does not exist or password not set"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                success: false,
                error: null,
                message: "Invalid password"
            });
        }

        let areas = null;
        if (user.institute_role === 'manager') {
            areas = await areaDAO.getAreasByManager(user.id);
        }

        const token = jwtService.generateAccessToken(
            user.id,
            user.institute_role
        );

        await userTokenDAO.create(
            new UserToken({ user_id: user.id, token })
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                id: user.id,
                name: user.name,
                email: user.email,
                institute_role: user.institute_role,
                area: user.area
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || error,
            message: "Error in login"
        });
    }
};


exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];

        const revoked = await userTokenDAO.invalidate(token);
        if (!revoked) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "No token"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Token successfully revoked"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || error,
            message: "Error in logout"
        });
    }
};





const UserDAO = require("../DAO/userDAO");
const bcrypt = require('bcrypt');
const jwtService = require("../utils/jwt");
const UserToken = require("../models/userToken");
const UserTokenDAO = require("../DAO/userTokenDAO");
const db = require('../database/db');


const userDAO = new UserDAO(db);
const userTokenDAO = new UserTokenDAO(db);


    exports.login = async (req, res, next) => {
        try {
            console.log(req.body);
            const { email, password } = req.body;

            const user = await userDAO.getUserByEmail(email);
            if (!user) {
                return res.status(404).send("User does not exist");
            }

            // Verifica senha
            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return res.status(400).send("Incorrect password");
            }

            const token = jwtService.generateAccessToken(user.id);

            userTokenDAO.create(new UserToken({user_id:user.id,token}));
            // Sucesso
            return res.status(200).json({
                message: "Login successful",
                token,
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles
            });



        } catch (error) {
            return res.status(500).send("Error in login: " + error);
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




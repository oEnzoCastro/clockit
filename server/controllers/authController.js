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

// ------------------- LOGIN -------------------
exports.login = async (req, res) => {
    try {
        const { email, password, institute_name, institute_acronym } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // buscar instituto
        let institute = null;
        if (institute_name) {
            institute = await instituteDAO.getInstitutebyName(institute_name);
        } else if (institute_acronym) {
            institute = await instituteDAO.getInstitutebyAcronym(
                institute_acronym.toUpperCase()
            );
        }

        if (!institute) {
            return res.status(404).json({ success: false, message: "Institute does not exist" });
        }

        // buscar usuário
        const user = await userDAO.getUserByEmail(email, institute.id);
        if (!user || !user.password) {
            return res.status(404).json({ success: false, message: "User does not exist or password not set" });
        }

        // validar senha
        const validPassword = await bcrypt.compare(password, user.password.toString());
        if (!validPassword) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        // buscar áreas se manager
        let areas = null;
        if (user.institute_role === 'manager') {
            areas = await areaDAO.getAreasByManager(user.id);
        }

        // gerar tokens
        const accessToken = jwtService.generateAccessToken(user.id, user.institute_role);
        const refreshToken = jwtService.generateRefreshToken(user.id);

        // salvar refresh token no banco
        await userTokenDAO.create(new UserToken({ user_id: user.id, token: refreshToken, type: 'refresh' }));

        // enviar refresh token via cookie HTTP-only
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 dias
        });

        // retornar access token no body
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,

                id: user.id,
                name: user.name,
                email: user.email,
                institute_role: user.institute_role,
                institute_id: institute.id,
                area: areas
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error in login", error: error.message });
    }
};

// ------------------- REFRESH TOKEN -------------------
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

        // verificar token
        const decoded = jwtService.verifyRefreshToken(refreshToken);

        // checar se existe no banco
        const storedToken = await userTokenDAO.findToken(decoded.userId, refreshToken);
        if (!storedToken) return res.status(403).json({ message: 'Refresh token revoked' });

        // gerar novo access token
        const user = await userDAO.getUserById(decoded.userId);
        const newAccessToken = jwtService.generateAccessToken(user.id, user.institute_role);

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid refresh token', error: err.message });
    }
};

// ------------------- LOGOUT -------------------
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

        // invalidar refresh token no banco
        await userTokenDAO.invalidate(refreshToken);

        // limpar cookie
        res.clearCookie('refreshToken');

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error in logout", error: error.message });
    }
};

// ------------------- ME -------------------
exports.me = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userDAO.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // se manager, buscar áreas como no login
    let areas = null;
    if (user.institute_role === 'manager') {
      areas = await areaDAO.getAreasByManager(user.id);
    }

    const institute_id = user.institute_id ?? user.instituteId ?? null;

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        institute_role: user.institute_role,
        institute_id,
        area: areas
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error in /me", error: error.message });
  }
};
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config(); // garante que as variáveis de ambiente estão carregadas

const ACCESS_EXPIRES = "15m";   // access token curto (15 min)
const REFRESH_EXPIRES = "7d";   // refresh token longo (7 dias)

const jwtService = {
    // ------------------- ACCESS TOKEN -------------------
    generateAccessToken(id, institute_role) {
        return jwt.sign(
            { userId: id, institute_role },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_EXPIRES }
        );
    },

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error("Access token verification failed:", error.message);
            throw error;
        }
    },

    // ------------------- REFRESH TOKEN -------------------
    generateRefreshToken(id) {
        return jwt.sign(
            { userId: id },
            process.env.JWT_REFRESH_SECRET, // precisa criar no .env
            { expiresIn: REFRESH_EXPIRES }
        );
    },

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            console.error("Refresh token verification failed:", error.message);
            throw error;
        }
    }
};

module.exports = jwtService;
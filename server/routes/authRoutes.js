const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// login → retorna access token + envia refresh token em cookie
router.post('/login', authController.login);

// logout → invalida refresh token e limpa cookie
router.post('/logout', authController.logout);

// refresh → gera novo access token usando refresh token do cookie
router.post('/refresh', authController.refreshToken);

module.exports = router;
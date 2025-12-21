const express = require('express');
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

router.get('/get',calendarController.get);

module.exports = router;
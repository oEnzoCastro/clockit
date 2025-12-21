const express = require('express');
const calendarController = require('../controllers/calendarController');

const router = express.Router();

router.get('/get',calendarController.get);

module.exports = router;
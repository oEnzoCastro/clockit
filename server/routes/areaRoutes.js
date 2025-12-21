const express = require('express');
const areaController = require('../controllers/areaController');

const router = express.Router();


router.get('/get',areaController.getAreas);
router.patch('/update',areaController.updateArea);


module.exports = router;

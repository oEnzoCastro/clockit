const express = require('express');
const areaController = require('../controllers/areaController');

const router = express.Router();


router.get('/getAreas',areaController.getAreas);
router.patch('/updateArea',areaController.updateArea);


module.exports = router;

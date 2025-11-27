const express = require('express');
const areaController = require('../controllers/areaController');

const router = express.Router();


router.get('/getAreas',areaController.getAreas);
router.get('/getAreaById',areaController.getAreaById);
router.get('/getAreaByName',areaController.getAreaByName);
router.get('/getAreaByAcronym',areaController.getAreaByAcronym);
router.patch('/updateArea',areaController.updateArea);


module.exports = router;

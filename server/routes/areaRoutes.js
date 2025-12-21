const express = require('express');
const areaController = require('../controllers/areaController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();


router.get('/get',areaController.getAreas);
router.put('/update',authMiddleware.isAuthorized,areaController.updateArea);


module.exports = router;

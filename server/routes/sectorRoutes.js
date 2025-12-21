const express = require('express');
const sectorController = require('../controllers/sectorController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post("/create",authMiddleware.isAuthorized, sectorController.create);
router.get("/get", sectorController.get);
router.put("/update",authMiddleware.isAuthorized,sectorController.update);
router.delete("/delete/:sector_id",authMiddleware.isAuthorized, sectorController.delete);


module.exports = router;
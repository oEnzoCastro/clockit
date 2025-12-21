const express = require('express');
const sectorController = require('../controllers/sectorController');

const router = express.Router();

router.post("/create", sectorController.create);
router.get("/get", sectorController.get);
router.put("/update",sectorController.update);
router.delete("/delete/:sector_id", sectorController.delete);


module.exports = router;
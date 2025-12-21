const express = require('express');
const agentSectorController = require('../controllers/agentSectorController');

const router = express.Router();

router.post("/create", agentSectorController.create);
router.get("/get", agentSectorController.get);
router.put("/update",agentSectorController.update);
router.put("/endContract/:agent_id/:sector_id",agentSectorController.cancelContract);
router.delete("/delete/:agent_id/:sector_id", agentSectorController.delete);



module.exports = router;
const express = require('express');
const agentSectorController = require('../controllers/agentSectorController');

const router = express.Router();

router.post("/cancelContract", agentSectorController.create);
router.get("/getAgentSector", agentSectorController.get);
router.patch("/updateContract",agentSectorController.update);
router.patch("/endContract",agentSectorController.cancelContract);
router.delete("/deleteContract/:id", agentSectorController.delete);



module.exports = router;
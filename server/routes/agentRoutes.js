const express = require('express');
const agentController = require('../controllers/agentController');

const router = express.Router();

router.post("/createAgent", agentController.createAgent);
router.get("/getAgent", agentController.getAgent);
router.patch("/updateAgent",agentController.updateAgent);
router.delete("/deleteAgent/:id", agentController.deleteAgent);


module.exports = router;
const express = require('express');
const agentController = require('../controllers/agentController');

const router = express.Router();

router.post("/create", agentController.createAgent);
router.get("/get", agentController.getAgent);
router.patch("/update",agentController.updateAgent);
router.delete("/delete/:id", agentController.deleteAgent);


module.exports = router;
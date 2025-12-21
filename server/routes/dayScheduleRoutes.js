const express = require('express');
const dayScheduleController = require('../controllers/dayScheduleController');

const router = express.Router();

router.post("/create", dayScheduleController.create);
router.get("/get", dayScheduleController.get);
router.put("/update",dayScheduleController.update);
router.delete("/delete/:agent_id/:sector_id/:schedule_day", dayScheduleController.delete);


module.exports = router;
const express = require('express');
const dayScheduleController = require('../controllers/dayScheduleController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post("/create", authMiddleware.isAuthorized,dayScheduleController.create);
router.get("/get", dayScheduleController.get);
router.put("/update",authMiddleware.isAuthorized,dayScheduleController.update);
router.delete("/delete/:agent_id/:sector_id/:schedule_day",authMiddleware.isAuthorized, dayScheduleController.delete);


module.exports = router;
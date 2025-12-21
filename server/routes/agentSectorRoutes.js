const express = require('express');
const agentSectorController = require('../controllers/agentSectorController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post("/create",authMiddleware.isAuthorized, agentSectorController.create);
router.get("/get", agentSectorController.get);
router.put("/update",authMiddleware.isAuthorized,agentSectorController.update);
router.put("/endContract/:agent_id/:sector_id",authMiddleware.isAuthorized,agentSectorController.cancelContract);
router.delete("/delete/:agent_id/:sector_id",authMiddleware.isAuthorized, agentSectorController.delete);



module.exports = router;
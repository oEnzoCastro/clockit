const express = require('express');
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middlewares/authMiddlewares');

const router = express.Router();

router.post("/create",authMiddleware.isAuthorized, agentController.createAgent);
router.get("/get",agentController.getAgent);
router.put("/update",authMiddleware.isAuthorized,agentController.updateAgent);
router.delete("/delete/:id", authMiddleware.isAuthorized,agentController.deleteAgent);


module.exports = router;
const db = require('../database/db');

const AgentDAO = require('../DAO/agentDAO');
const User = require('../models/user');
const AgentSector = require('../models/agentSector');
const AgentSectorDAO = require('../DAO/agentSectorDAO');



const agentSectorDAO = new AgentSectorDAO(db);


exports.get = async (req, res, next) => {
    try {
        const result = await agentSectorDAO.findSectors(req.body);

        if (!result) {
            return res.status(500).send("Failed to get sectors");
        }

        return res.status(200).json({
            data: result, // always an array
            message: "Successfully fetched agentSectors"
        });
    } catch (error) {
        return res.status(400).send("Failed to get agentSectos: " + error);
    }
}
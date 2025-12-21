const db = require('../database/db');

const AgentDAO = require('../DAO/agentDAO');
const User = require('../models/user');
const AgentSector = require('../models/agentSector');
const AgentSectorDAO = require('../DAO/agentSectorDAO');



const agentSectorDAO = new AgentSectorDAO(db);


exports.get = async (req, res) => {
    try {
        const result = await agentSectorDAO.findSectors(req.query);

        if (!result || (Array.isArray(result) && result.length === 0)) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "agentSectors not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result, // already an array
            message: "Successfully fetched agentSectors"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to get agentSectors"
        });
    }
};

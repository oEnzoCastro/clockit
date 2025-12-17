const db = require('../database/db');

const AgentDAO = require('../DAO/agentDAO');
const User = require('../models/user');
const AgentSector = require('../models/agentSector');
const AgentSectorDAO = require('../DAO/agentSectorDAO');



const agentSectorDAO = new AgentSectorDAO(db);



exports.cancelContract = async (req, res, next) => {
    const { sector_id, agent_id } = req.body;
    try {
        const agent = await agentSectorDAO.cancelContract(agent_id, sector_id);

        if (!agent) {
            return res.status(500).send("Failed to update Agent");
        }

        return res.status(200).json({
            success: true,
            message: "Successfully canceled contract"
        });
    } catch (error) {
        return res.status(400).send("Failed to update Agent: " + error);
    }
};

exports.create = async (req, res, next) => {
    const { sector_id, agent_id, agent_workload, sector_region, sector_location, sector_description, is_hidden, constract_start, contract_end } = req.body;
    try {
        const agentSector = await agentSectorDAO.create(new AgentSector({ sector_id, agent_id, agent_workload, sector_region, sector_location, sector_description, is_hidden, constract_start, contract_end }));

        if (!agentSector) {
            return res.status(500).send("Failed to create Agent");
        }

        return res.status(200).json({
            data: agentSector.toJSON(), // always an array
            message: "Successfully created contract"
        });
    } catch (error) {
        return res.status(400).send("Failed to Create: " + error);
    }
};


exports.update = async (req, res, next) => {
    const { sector_id, agent_id, agent_workload, sector_region, sector_location, sector_description, is_hidden, constract_start, contract_end } = req.body;
    try {
        const agentSector = await agentSectorDAO.update(new AgentSector({ sector_id, agent_id, agent_workload, sector_region, sector_location, sector_description, is_hidden, constract_start, contract_end }));

        if (!agentSector) {
            return res.status(500).send("Failed to update Contract");
        }

        return res.status(200).json({
            data: agentSector.toJSON(), // always an array
            message: "Successfully updated contract"
        });
    } catch (error) {
        return res.status(400).send("Failed to update Contract: " + error);
    }
};


exports.delete = async (req, res, next) => {
    const { sector_id, agent_id } = req.body;
    try {
        const result = await agentSectorDAO.delete(agent_id, sector_id);

        if (!result) {
            return res.status(500).json({
                success: false,
                message: "Successfully deleted contract"
            }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Successfully deleted contract"
        });
    } catch (error) {
        return res.status(400).send("Failed to delete Contracts: " + error);
    }
};
exports.get = async (req, res, next) => {
    try {
        const result = await agentSectorDAO.findByAgent(req.body);

        if (!result) {
            return res.status(500).send("Failed to get Contract");
        }

        return res.status(200).json({
            data: result, // always an array
            message: "Successfully fetched contract"
        });
    } catch (error) {
        return res.status(400).send("Failed to get Contracts: " + error);
    }
}



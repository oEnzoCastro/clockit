const db = require('../database/db');

const AgentSector = require('../models/agentSector');
const AgentSectorDAO = require('../DAO/agentSectorDAO');

const agentSectorDAO = new AgentSectorDAO(db);

exports.cancelContract = async (req, res) => {
    const { sector_id, agent_id } = req.params;

    try {
        const agent = await agentSectorDAO.cancelContract(agent_id, sector_id);

        if (!agent) {
            return res.status(500).json({
                success: false,
                error: null,
                message: "Failed to cancel contract"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully canceled contract"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to cancel contract"
        });
    }
};

exports.create = async (req, res) => {
    const {
        sector_id,
        agent_id,
        agent_workload,
        sector_region,
        sector_location,
        description,
        is_hidden,
        contract_start,
        contract_end,
        daySchedules
    } = req.body;

    try {
        const agentSector = await agentSectorDAO.create(
            new AgentSector({
                sector_id,
                agent_id,
                agent_workload,
                sector_region,
                sector_location,
                description,
                is_hidden,
                contract_start,
                contract_end,
                daySchedules
            })
        );

        if (!agentSector) {
            return res.status(500).json({
                success: false,
                error: null,
                message: "Failed to create contract"
            });
        }

        return res.status(200).json({
            success: true,
            data: agentSector,
            message: "Successfully created contract"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to create contract"
        });
    }
};

exports.update = async (req, res) => {
    const {
        sector_id,
        agent_id,
        agent_workload,
        sector_region,
        sector_location,
        description,
        is_hidden,
        contract_start,
        contract_end,
        daySchedules
    } = req.body;

    try {
        const agentSector = await agentSectorDAO.update(
            new AgentSector({
                sector_id,
                agent_id,
                agent_workload,
                sector_region,
                sector_location,
                description,
                is_hidden,
                contract_start,
                contract_end,
                daySchedules
            })
        );

        if (!agentSector) {
            return res.status(500).json({
                success: false,
                error: null,
                message: "Failed to update contract"
            });
        }

        return res.status(200).json({
            success: true,
            data: agentSector,
            message: "Successfully updated contract"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to update contract"
        });
    }
};

exports.delete = async (req, res) => {
    const { sector_id, agent_id } = req.body;

    try {
        const result = await agentSectorDAO.delete(agent_id, sector_id);

        if (!result) {
            return res.status(500).json({
                success: false,
                error: null,
                message: "Failed to delete contract"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully deleted contract"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to delete contract"
        });
    }
};

exports.get = async (req, res) => {
    try {
        const result = await agentSectorDAO.findByAgent(req.query);

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                error: null,
                message: "No contract found"
            });
        }

        return res.status(200).json({
            success: true,
            data: result,
            message: "Successfully fetched contract"
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message || error,
            message: "Failed to get contracts"
        });
    }
};

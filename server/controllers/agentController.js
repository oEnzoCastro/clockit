const db = require('../database/db');
const AgentDAO = require('../DAO/agentDAO');
const User = require('../models/user');
const AgentSectorDAO = require('../DAO/agentSectorDAO');

const agentDAO = new AgentDAO(db);
const agentSectorDAO = new AgentSectorDAO(db);

function filterAgents(agentOrArray) {
    if (!agentOrArray) return [];

    const agents = Array.isArray(agentOrArray) ? agentOrArray : [agentOrArray];

    return agents.map(agent => {
        const json = agent.toJSON();
        return {
            first_name: json.first_name,
            surname: json.surname,
            email: json.email,
            institute_id: json.institute_id,
            institute_role: json.institute_role,
            contract_start: json.contract_start,
            contract_end: json.contract_end,

            area: agent.area ? agent.area : null
        };
    });
}

function isEmail(email){
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}

exports.createAgent = async (req, res) => {
    const {
        first_name,
        surname,
        email,
        password,
        institute_id,
        institute_role,
        area,
        contract_start,
        contract_end
    } = req.body;

    try {
        if(!email || !isEmail(email)){
            throw new Error("Invalid email");
        }

        const agent = await agentDAO.create(
            new User({
                first_name,
                surname,
                email,
                password_hash: password,
                institute_id,
                institute_role,
                area,
                contract_start,
                contract_end
            })
        );
        
        if (!agent) {
            return res.status(500).send({
                success: false, 
                data: null,
                message: "Failed to create agent"
            });
        }

        return res.status(200).send({
            success: true,
            data: filterAgents(agent),
            message: "Successfully created agent"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            data: null,
            message: "Failed to create agent: " + error.message
        });
    }
};

exports.updateAgent = async (req, res) => {
    const {
        id,
        first_name,
        surname,
        email,
        password,
        institute_id,
        institute_role,
        area,

        // ✅ ADICIONADOS
        contract_start,
        contract_end
    } = req.body;

    try {
        if(!id){
            throw new Error("ID is missing");
        }
        if(!email || !isEmail(email)){
            throw new Error("Invalid email");
        }

        const agent = await agentDAO.update(
            new User({
                id,
                first_name,
                surname,
                email,
                password_hash: password,
                institute_id,
                institute_role,
                area,

                // ✅ ADICIONADOS
                contract_start,
                contract_end
            })
        );
        
        if (!agent) {
            return res.status(500).send({
                success: false,
                data: null,
                message: "Failed to update agent"
            });
        }

        return res.status(200).send({
            success: true,
            data: filterAgents(agent),
            message: "Successfully updated agent"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            data: null,
            message: "Failed to update agent: " + error.message
        });
    }
};

exports.getAgent = async (req, res) => {
    try {
        const agent = await agentDAO.findAgents(req.query);

        if (!agent || (Array.isArray(agent) && agent.length === 0)) {
            return res.status(404).send({
                success: false,
                data: null,
                message: "Agent not found"
            });
        }

        return res.status(200).send({
            success: true,
            data: filterAgents(agent),
            message: "Successfully fetched agent"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            data: null,
            message: "Failed to fetch agent: " + error.message
        });
    }
};

exports.deleteAgent = async (req, res) => {
    const { id } = req.params;
    try {
        const rows = await agentDAO.delete(id);
        if (!rows) {
            return res.status(500).send({
                success: false,
                data: null,
                message: "Agent not found"
            });
        }

        return res.status(200).send({
            success: true,
            data: null,
            message: "Successfully deleted agent"
        });

    } catch (error) {
        return res.status(400).send({
            success: false,
            data: null,
            message: "Failed to delete agent: " + error.message
        });
    }
};
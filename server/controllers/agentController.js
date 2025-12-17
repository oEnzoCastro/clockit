const db = require('../database/db');

const AgentDAO = require('../DAO/agentDAO');
const User = require('../models/user');
const AgentSectorDAO = require('../DAO/agentSectorDAO');


const agentDAO = new AgentDAO(db);
const agentSectorDAO = new AgentSectorDAO(db);

function filterAgents(agentOrArray) {
    if (!agentOrArray) return [];

    // Convert single agent to array for uniform processing
    const agents = Array.isArray(agentOrArray) ? agentOrArray : [agentOrArray];

    return agents.map(agent => {
        const json = agent.toJSON();
        return {
            first_name: json.first_name,
            surname: json.surname,
            email: json.email,
            institute_id: json.institute_id,
            roles: json.roles,
            area: agent.area ? agent.area.toJSON() : null
        };
    });
}




exports.createAgent = async (req, res, next) => {
    const { first_name, surname, email, password, institute_id, roles,area} = req.body;
    try {
        const agent = await agentDAO.create(new User({ first_name, surname, email, password_hash: password, institute_id, roles, area }));
        if (!agent) {
            return res.status(500).send("Failed to create Agent");
        }
        return res.status(200).json({
            data: filterAgent(agent),
            message: "Succesful in creating agent"
        });
    } catch (error) {
        return res.status(400).send("Failed to  create Agent" + error);
    }
};

exports.updateAgent = async (req, res, next) => {
    const { id, first_name, surname, email, password, institute_id, roles, area} = req.body;
    try {
        const agent = await agentDAO.update(new User({
            id,
            first_name,
            surname,
            email,
            password_hash: password,
            institute_id,
            roles,
            area
        }));

        if (!agent) {
            return res.status(500).send("Failed to update Agent");
        }

        return res.status(200).json({
            data: filterCreateAgents(agent), // always an array
            message: "Successfully updated agent"
        });
    } catch (error) {
        return res.status(400).send("Failed to update Agent: " + error);
    }
};
exports.getAgent = async (req, res, next) => {
   
    try {
        const agent = await agentDAO.findAgents(req.body);

        if (!agent) {
            return res.status(500).send("Failed to get Agent");
        }

        return res.status(200).json({
            data: filterCreateAgents(agent), // always an array
            message: "Successfully fetch agent"
        });
    } catch (error) {
        return res.status(400).send("Failed to fetch Agent: " + error);
    }
};




exports.deleteAgent = async (req, res, next) => {
    const { id } = req.body;
    try {
        const rows = await agentDAO.delete(id);
        if (!rows) {
            return res.status(500).send("Agent Not found");
        }
        return res.status(200).json({
            success:true,
            message: "Succesful in deleting agent"
        });
    } catch (error) {
        return res.status(400).send("Failed to  delete Agent" + error);
    }
};


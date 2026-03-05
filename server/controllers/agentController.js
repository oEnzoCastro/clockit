const AgentDAO = require('../DAO/agentDAO');
const User = require('../models/user');
const AgentSectorDAO = require('../DAO/agentSectorDAO');
const UserDAO = require('../DAO/userDAO');

const db = require('../database/db');
const userDAO = new UserDAO(db);
const agentDAO = new AgentDAO(db);
const agentSectorDAO = new AgentSectorDAO(db);

function filterAgents(agentOrArray) {
  if (!agentOrArray) return [];

  const agents = Array.isArray(agentOrArray) ? agentOrArray : [agentOrArray];

  return agents.map(agent => {
    const json = agent.toJSON();
    return {
      id: json.id,
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

function isEmail(email) {
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

// ------------------- CREATE AGENT -------------------
exports.createAgent = async (req, res) => {
  const {
    first_name,
    surname,
    email,
    password,
    area, // ✅ esperado: { id: "..." }
    contract_start,
    contract_end,
  } = req.body;

  try {
    // ✅ precisa vir do middleware (isAuthorized -> isAuthenticated)
    const managerId = req.userId;
    if (!managerId) {
      return res.status(401).send({
        success: false,
        data: null,
        message: 'Unauthorized',
      });
    }

    if (!email || !isEmail(email)) {
      throw new Error('Invalid email');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (!area?.id) {
      throw new Error('area.id is required');
    }

    // ✅ pega institute_id do manager no banco (não confia no front)
    const manager = await userDAO.getUserById(managerId);
    if (!manager) throw new Error('Manager not found');

    const institute_id = manager.institute_id ?? manager.instituteId;
    if (!institute_id) throw new Error('Manager institute_id not found');

    // ✅ define a role no backend
    const institute_role = 'agent';

    // ✅ NÃO faça hash aqui: seu UserDAO.create já faz bcrypt.hash(password, 10)
    const agent = await agentDAO.create(
      new User({
        first_name,
        surname,
        email,
        password, // ✅ o DAO faz o hash
        institute_id,
        institute_role, // AgentDAO também força 'agent', mas não tem problema
        area, // ✅ { id: ... } -> UserDAO converte para area_id
        contract_start,
        contract_end,
      })
    );

    if (!agent) {
      return res.status(500).send({
        success: false,
        data: null,
        message: 'Failed to create agent',
      });
    }

    return res.status(200).send({
      success: true,
      data: filterAgents(agent),
      message: 'Successfully created agent',
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      data: null,
      message: 'Failed to create agent: ' + error.message,
    });
  }
};

// ------------------- UPDATE AGENT -------------------
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
    contract_start,
    contract_end,
  } = req.body;

  try {
    if (!id) throw new Error('ID is missing');
    if (!email || !isEmail(email)) throw new Error('Invalid email');

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
        contract_start,
        contract_end,
      })
    );

    if (!agent) {
      return res.status(500).send({
        success: false,
        data: null,
        message: 'Failed to update agent',
      });
    }

    return res.status(200).send({
      success: true,
      data: filterAgents(agent),
      message: 'Successfully updated agent',
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      data: null,
      message: 'Failed to update agent: ' + error.message,
    });
  }
};

// ------------------- GET AGENT(S) -------------------
exports.getAgent = async (req, res) => {
  try {
    const agent = await agentDAO.findAgents(req.query);

    if (!agent || (Array.isArray(agent) && agent.length === 0)) {
      return res.status(404).send({
        success: false,
        data: null,
        message: 'Agent not found',
      });
    }

    return res.status(200).send({
      success: true,
      data: filterAgents(agent),
      message: 'Successfully fetched agent',
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      data: null,
      message: 'Failed to fetch agent: ' + error.message,
    });
  }
};

// ------------------- DELETE AGENT -------------------
exports.deleteAgent = async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await agentDAO.delete(id);
    if (!rows) {
      return res.status(500).send({
        success: false,
        data: null,
        message: 'Agent not found',
      });
    }

    return res.status(200).send({
      success: true,
      data: null,
      message: 'Successfully deleted agent',
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      data: null,
      message: 'Failed to delete agent: ' + error.message,
    });
  }
};
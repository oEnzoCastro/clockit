
const UserDAO = require('./userDAO');
const User = require('../models/user');
const SectorDAO = require('./sectorDAO');
const db = require('../database/db');



class AgentDAO extends UserDAO {
    constructor(db) {
        super(db);
        this.sectorDAO = new SectorDAO(db);
    }

    async create(agentData) {
        const trx = await this.db.transaction();

        try {
            if (!(agentData instanceof User)) {
                throw new Error("user must be an instance of User or Agent");
            }

            agentData.institute_role = 'agent';
            const user = await super.create(agentData, trx);

            await trx.commit();
            return new User(user);
        } catch (error) {
            await trx.rollback();
            console.error('Error in create(): in agent', error);
            throw error;
        }
    }


    async findAgents(filters = {}, trx = this.db) {
        const {
            id,
            email,
            first_name,
            surname,
            institute_id
        } = filters;

        const query = trx('users')
            .where({ institute_role: 'agent' });

        if (id) query.andWhere('id', id);
        if (email) query.andWhere('email', email);
        if (first_name) query.andWhereILike('first_name', `%${first_name}%`);
        if (surname) query.andWhereILike('surname', `%${surname}%`);
        if (institute_id) query.andWhere('institute_id', institute_id);

        const rows = await query;

        return rows.map(row => new User(row));
    }


    async removeAgent(id) {
        const trx = await this.db.transaction();
        try {

            const user = await this.getUserById(id, trx);
            if (!user) throw new Error("User does not exist");
            if (!user.roles.includes('agent')) {
                throw new Error("User is not a Agent");
            }

            const rows = await trx('user_roles').where({ user_id: id, role: 'agent' }).del();

            if (rows > 0) {
                await trx.commit();
                return true;
            } else {
                await trx.rollback();
                return false;
            }


        } catch (error) {
            await trx.rollback();
            console.error("Error in removeAgent:", error);
            throw error;
        }
    }

}
module.exports = AgentDAO;


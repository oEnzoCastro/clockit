
const UserDAO = require('./userDAO');
const User = require('../models/user');
const SectorDAO = require('./sectorDAO');




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
            institute_id,
            area_id
        } = filters;

        const query = trx('users')
            .leftJoin('area', 'users.area_id', 'area.id')
            .select(
                'users.*',
                'area.id as area_id',
                'area.area_name as area_name',
                'area.acronym as area_acronym'
            )
            .where('users.institute_role', 'agent');

        if (institute_id) {
            query.andWhere('users.institute_id', institute_id);
        }
        if (area_id) {
            query.andWhere('users.area_id', area_id);
        }

        if (area_id || institute_id) {
            if (email) query.andWhere('users.email', email);

            if (first_name) query.andWhere('users.first_name', first_name);
            if (surname) query.andWhere('users.surname', surname);
        }


        if (id) query.andWhere('users.id', id);

        const rows = await query;


        return rows.map(row => new User({
            ...row,
            area: row.area_id ? {
                id: row.area_id,
                name: row.area_name,
                acronym: row.area_acronym
            } : null
        }));
    }


    async removeAgent(id) {
        const trx = await this.db.transaction();
        try {

            const user = await this.getUserById(id, trx);
            if (!user) throw new Error("User does not exist");
            if (!user.institute_role('agent')) {
                throw new Error("User is not a Agent");
            }

            const rows = await trx('users').where({ user_id: id }).del();

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
/*
async function main() {

    const agentDAO = new AgentDAO(db);

    try {
        console.log('=== CREATE AGENT ===');
        const agent = new User({
            first_name: 'John',
            surname: 'Doe',
            email: `john.doe${Date.now()}@example.com`, // unique
            password: 'secret123',
            institute_id: "d805733c-d52d-49cc-b6fe-7901a9a5f036" // make sure this exists
        });

        const created = await agentDAO.create(agent);
        console.log('Created agent:', created);

        console.log('\n=== FIND AGENT BY ID ===');
        const byId = await agentDAO.findAgents({ id: created.id });
        console.log(byId);

        console.log('\n=== FIND AGENT BY INSTITUTE ===');
        const byInstitute = await agentDAO.findAgents({ institute_id: created.institute_id });
        console.log(byInstitute.map(a => ({ id: a.id, email: a.email })));

        console.log('\n=== REMOVE AGENT ===');
        const removed = await agentDAO.removeAgent(created.id);
        console.log('Removed agent?', removed);

        console.log('\n=== VERIFY REMOVAL ===');
        const afterRemoval = await agentDAO.findAgents({ id: created.id });
        console.log(afterRemoval); // should be empty array

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        await db.destroy();
    }
}

// Run the test
main();

*/
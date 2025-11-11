//const db = require('../database/db');
const UserDAO = require('./userDAO');
const User = require('../models/user');
const SectorDAO = require('./sectorDAO');
const Agent = require('../models/agent');


class AgentDAO extends UserDAO {
    constructor(db) {
        super(db);
        this.sectorDAO = new SectorDAO(db);
    }

    async create(agentData) {
        const trx = await this.db.transaction();

        try {
            if (!(agentData instanceof User || agentData instanceof Agent)) {
                throw new Error("user must be an instance of user or Agent");
            }

            const user = await super.create(agentData);
            await trx('user_roles').insert({
                user_id: user.id,
                role: 'agent'
            });
            await trx.commit();
            return new Agent(user);
        } catch (error) {
            // Rollback and handle the error
            await trx.rollback();
            console.error('Error in create(): in agent', error);
            throw error;
        }
    }

    async promoteToAgent(id) {
        const trx = await this.db.transaction();

        try {

            const user = await this.getUserById(id, trx);
            if (!user) {
                throw new Error("User does not exist");
            }


            if (Array.isArray(user.roles) && user.roles.includes('agent')) {
                throw new Error("User is already a Agent");
            }


            await trx('user_roles').insert({
                user_id: id,
                role: 'agent'
            });


            await trx.commit();


            const updatedRoles = Array.from(new Set([...user.roles, 'agent']));

            return new User({ ...user, roles: updatedRoles });

        } catch (error) {
            await trx.rollback();
            console.error("Error in promoteToAgent:", error);
            throw error;
        }
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
/*
async function main() {
    const agentDAO = new AgentDAO(db);

    try {
        console.log('=== TEST START ===');

        // 1️⃣ Create a new user (who will be an Agent)
        console.log('Creating new agent...');
        const newUser = new User({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: '123456', // assuming hashing is handled in DAO or model
            institute_id:'3a2ad40e-c63d-48ee-baf1-bf56081edd25',
            is_hidden: false
        });

        const createdAgent = await agentDAO.create(newUser);
        console.log('✅ Created Agent:', createdAgent);

        // 2️⃣ Promote an existing user to Agent
        console.log('Promoting existing user to Agent...');
        const promotedUser = await agentDAO.promoteToAgent(createdAgent.id);
        console.log('✅ Promoted to Agent:', promotedUser);

        // 3️⃣ Try promoting again (should fail)
        try {
            console.log('Trying to promote again (expected to fail)...');
            await agentDAO.promoteToAgent(createdAgent.id);
        } catch (err) {
            console.log('✅ Expected error:', err.message);
        }

        // 4️⃣ Remove Agent role
        console.log('Removing Agent role...');
        const removed = await agentDAO.removeAgent(createdAgent.id);
        console.log('✅ Removed Agent role:', removed);

        // 5️⃣ Try removing again (should fail)
        try {
            console.log('Trying to remove again (expected to fail)...');
            await agentDAO.removeAgent(createdAgent.id);
        } catch (err) {
            console.log('✅ Expected error:', err.message);
        }

        console.log('=== TEST COMPLETE ===');
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await db.destroy(); // Always close DB connection when done
    }
}

main();*/
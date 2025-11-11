//const db = require('../database/db');
const Manager = require("../models/manager");
const UserDAO = require('./userDAO');
const AreaDAO = require('./areaDAO');
const User = require('../models/user');
const Area = require('../models/area');
const AreaManager = require('../models/areaManager')


class ManagerDAO extends UserDAO {
    constructor(db) {
        super(db)
        this.areaDAO = new AreaDAO(db);
    }

    async create(managerData) {
        const trx = await this.db.transaction();

        try {
            if (!(managerData instanceof User || managerData instanceof Manager)) {
                throw new Error("user must be an instance of user or Manager");
            }
            
            const user = await super.create(managerData, trx);

         
            await trx('user_roles').insert({
                user_id: user.id,
                role: 'Manager'
            });

            
            await trx.commit();

           
            return new Manager(user);

        } catch (error) {
            
            await trx.rollback();
            console.error('Error in create(): in manager', error);
            throw error;
        }
    }


    async promoteToManager(id) {
        const trx = await this.db.transaction();

        try {
           
            const user = await this.getUserById(id, trx);
            if (!user) {
                throw new Error("User does not exist");
            }

            
            if (Array.isArray(user.roles) && user.roles.includes('Manager')) {
                throw new Error("User is already a Manager");
            }

            
            await trx('user_roles').insert({
                user_id: id,
                role: 'Manager'
            });

            
            await trx.commit();

            
            const updatedRoles = Array.from(new Set([...user.roles,'Manager']));

            return new User({ ...user, roles: updatedRoles });

        } catch (error) {
            await trx.rollback();
            console.error("Error in promoteToManager:", error);
            throw error;
        }
    }

    async assignManagerToArea(manager_id, area_id) {
        const trx = await this.db.transaction();

        try {
            
            const manager = await this.getUserById(manager_id, trx);
            if (!manager) throw new Error("Manager not found");

            
            const area = await this.areaDAO.getAreaById(area_id, trx);
            if (!area) throw new Error("Area not found");

            
            const exists = await trx('manager_area')
                .where({ manager_id, area_id })
                .first();
            if (exists) throw new Error("Manager already assigned to this area");

            
            const [newAreaManager] = await trx('manager_area').insert({ manager_id, area_id }).returning('*');

            if(!newAreaManager){
                throw new Error("Failed in assigning manager to area");
            }

            await trx.commit();

            return new AreaManager(manager_id,area_id);

        } catch (error) {
            await trx.rollback();
            console.error("Error in assignManagerToArea:", error);
            throw error;
        }
    }

    async removeManagerFromArea(manager_id, area_id) {
        const trx = await this.db.transaction();

        try {
            
            const existing = await trx('manager_area')
                .where({ manager_id, area_id })
                .first();

            if (!existing) {
                throw new Error("Manager not assigned to this area");
            }

       
            const deleted = await trx('manager_area')
                .where({ manager_id, area_id })
                .del();

            if (deleted > 0) {
                await trx.commit();
                return true;
            } else {
                await trx.rollback();
                return false;
            }


        } catch (error) {
            await trx.rollback();
            console.error("Error in removeManagerFromArea:", error);
            throw error;
        }
    }





    async removeManager(id) {
        const trx = await this.db.transaction();
        try {

            const user = await this.getUserById(id, trx);
            if (!user) throw new Error("User does not exist");
            console.log(user.roles)
            if (!user.roles.includes('Manager')) {
                throw new Error("User is not a Manager");
            }

            const rows = await trx('user_roles').where({ user_id: id, role: 'Manager' }).del();

            if (rows > 0) {
                await trx.commit();
                return true;
            } else {
                await trx.rollback();
                return false;
            }


        } catch (error) {
            await trx.rollback();
            console.error("Error in removeManager:", error);
            throw error;
        }
    }


    async getManagersByInstitute(institute_id) {
        try {
            const users = await this.getUsersByInstitute(institute_id);

            if (!users || users.length === 0) {
                return [];
            }

            
            const managers = users.filter(user =>
                Array.isArray(user.roles) && user.roles.includes('Manager')
            );

            console.log(`Found ${managers.length} managers for institute ${institute_id}`);
            return managers;

        } catch (error) {
            console.error("Error in getManagersByInstitute:", error);
            throw error;
        }
    }

    async getManagersByArea(area_id) {
        try {
            const managersArea = await this.db('manager_area').where({ area_id });

            if (!managersArea || managersArea.length === 0) {
                return [];
            }

           
            const users = await Promise.all(
                managersArea.map(ma => this.getUserById(ma.manager_id))
            );

            console.log('Managers fetched successfully');
            return users;

        } catch (error) {
            console.error("Error in getManagersByArea:", error);
            throw error;
        }
    }



}
/*
async function main() {
    const managerDAO = new ManagerDAO(db);
    const areaDAO = new AreaDAO(db);
    const userDAO = new UserDAO(db);

    try {
        console.log("===== STARTING MANAGER DAO TESTS =====");

        // 1️⃣ Create a test user (future manager)
        console.log("\n> Creating base user...");
        const newUser = await userDAO.create(
            new User({
                first_name: "Alice Manager",
                email: "alice.manager@example.com",
                password_hash: "test123",
                institute_id: "3a2ad40e-c63d-48ee-baf1-bf56081edd25" // must exist in your DB
            })
        );
        console.log("User created:", newUser);

        // 2️⃣ Promote to Manager
        console.log("\n> Promoting user to Manager...");
        const promotedManager = await managerDAO.promoteToManager(newUser.id);
        console.log("Promoted Manager:", promotedManager);

        // 3️⃣ Create an Area for testing
        console.log("\n> Creating test Area...");
        const testArea = await areaDAO.create(
            new Area({
                institute_id: '3a2ad40e-c63d-48ee-baf1-bf56081edd25',
                acronym: "CS",
                area_name: "Computer Science"
            })
        );
        console.log("Area created:", testArea);

        // 4️⃣ Assign Manager to Area
        console.log("\n> Assigning Manager to Area...");
        const assignRes = await managerDAO.assignManagerToArea(promotedManager.id, testArea.id);
        console.log("Assignment Result:", assignRes);

        // 5️⃣ Get Managers by Area
        console.log("\n> Fetching Managers by Area...");
        const managersByArea = await managerDAO.getManagersByArea(testArea.id);
        console.log("Managers in this area:", managersByArea);

        // 6️⃣ Get Managers by Institute
        console.log("\n> Fetching Managers by Institute...");
        const managersByInstitute = await managerDAO.getManagersByInstitute(newUser.institute_id);
        console.log("Managers in this institute:", managersByInstitute);

        // 7️⃣ Get Areas by Manager
        console.log("\n> Fetching Areas by Manager...");
        const areasByManager = await areaDAO.getAreasByManager(promotedManager.id);
        console.log("Areas for this manager:", areasByManager);

        // 8️⃣ Remove Manager from Area
        console.log("\n> Removing Manager from Area...");
        const removeAreaRes = await managerDAO.removeManagerFromArea(promotedManager.id, testArea.id);
        console.log("Removed relation:", removeAreaRes);

        // 9️⃣ Remove Manager role
        console.log("\n> Removing Manager role...");
        const removedManager = await managerDAO.removeManager(promotedManager.id);
        console.log("Manager role removed:", removedManager);

        console.log("\n===== ALL TESTS COMPLETED SUCCESSFULLY =====");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error);
    } finally {
        // Ensure DB connection is closed
        await db.destroy();
        console.log("Database connection closed.");
    }

}

main();*/

module.exports = ManagerDAO;
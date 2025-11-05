const db = require('../database/db');
const Director = require("../models/director");
const User = require("../models/user");
const UserDAO = require('./userDAO');

class DirectorDAO extends UserDAO {
    constructor(db) {
        super(db);
    }

    async createDirector(userData) {
        const trx = await this.db.transaction();
        try {
            const user = await super.create(userData, trx);

            await trx('user_roles').insert({
                user_id: user.id,
                role: 'Director'
            });

            await trx.commit();
            return new Director(user);
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }

    async promoteToDirector(id) {
        const trx = await this.db.transaction();
        try {

            const user = await this.getUserById(id, trx);
            if (!user) throw new Error("User does not exist");

            if (user.roles.includes('Director')) {
                throw new Error("User is already a Director");
            }

            await trx('user_roles').insert({ user_id: id, role: 'Director' });

            await trx.commit();

            return new User({ ...user, roles: [...user.roles, 'Director'] });

        } catch (error) {
            await trx.rollback();
            console.error("Error in addDirector:", error);
            throw error;
        }
    }

    async removeDirector(id) {
        const trx = await this.db.transaction();
        try {

            const user = await this.getUserById(id, trx);
            if (!user) throw new Error("User does not exist");
            console.log(user.roles)
            if (!user.roles.includes('Director')) {
                throw new Error("User is not a director");
            }

            const rows = await trx('user_roles').where({ user_id: id, role: 'Director' }).del();

            if (rows <= 0) {
                throw new Error("Error in deleting user");
            }

            await trx.commit();
            const roles = user.roles.filter(role => role !== 'Director');

            return new User({...user,roles});

        } catch (error) {
            await trx.rollback();
            console.error("Error in removeDirector:", error);
            throw error;
        }
    }

    async getDirectorsByInstitute(institute_id) {
        try {
            const users = await this.getUsersByInstitute(institute_id);


            if (!users || users.length <= 0) {
                await trx.commit(); // commit, not rollback — nothing went wrong
                return [];
            }
            console.log('teste');

            const directors = users.filter(user =>
                !user.roles || !user.roles.includes('Director')
            );

            return directors

        } catch (error) {
            console.error("Error in getDirectors:", error);
            throw error;

        }
    }

    async getDirectorById(id) {
        try {
            const director = await this.getUserById(id);
            if (!director && !director.roles.includes('Director')) {
                return null;
            }

            return director
        } catch (error) {

        }
    }

}
/*
async function main() {
    const directorDAO = new DirectorDAO();

    // Example institute (UUID)
    const institute_id = '3a2ad40e-c63d-48ee-baf1-bf56081edd25';
    const id = 'dbdc7e29-60f1-4e9a-a72f-a89ed0d57aae';

    try {
        console.log('--- Creating a new director ---');
        /*const newDirector = await directorDAO.createDirector(new User({
            first_name: 'Alice',
            last_name: 'Santos',
            email: 'alice.santos@example.com',
            password_hash: '123456',
            institute_id:institute_id,
        }));
        const newDirector = await directorDAO.createDirector(new User({
            first_name: 'Bruno',
            last_name: 'Ferreira',
            email: 'bruno.ferreira@example.com',
            password_hash: '123456', // Remember to hash in production
            institute_id: institute_id,
        }));

        
        console.log('\n--- Getting directors by institute ---');
        const directors = await directorDAO.getDirectorsByInstitute(institute_id);
        console.log('✅ Directors:', directors);
        
        console.log('\n--- Removing director role ---');
        const removed = await directorDAO.removeDirector(id);
        console.log('✅ After removal:', removed);

        console.log('\n--- Promoting existing user to director ---');
        const promoted = await directorDAO.promoteToDirector(id);
        console.log('✅ Promoted user:', promoted);

        console.log('\n--- Getting director by ID ---');
        const found = await directorDAO.getDirectorById(id);
        console.log('✅ Found:', found);

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await db.destroy(); // close Knex connection
    }
}

main();

*/

module.exports = DirectorDAO;
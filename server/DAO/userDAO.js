const User = require('../models/user');
const InstituteDAO = require('./instituteDAO');
const bcrypt = require('bcrypt');

class UserDAO {
    constructor(db) {
        this.db = db;
        this.instituteDAO = new InstituteDAO(db);
    }

   
    async findUsers(filters = {}, trx = this.db) {
        try {
            const {
                id,
                email,
                first_name,
                surname,
                institute_id,
                code,
                institute_role,
                sector_id
            } = filters;

            const query = trx('users');

            if (id) query.where({ id });
            if (email) query.where({ email });
            if (first_name) query.where({ first_name });
            if (surname) query.where({ surname });
            if (institute_id) query.where({ institute_id });
            if (code) query.where({ code });
            if (institute_role) query.where({ institute_role });
            if (sector_id) query.where({ sector_id });

            const rows = await query;
            return rows.map(r => new User({ ...r }));
        } catch (error) {
            console.error('Error in findUsers():', error);
            throw error;
        }
    }

    
    async getUserById(id, trx = this.db) {
        const res = await this.findUsers({ id }, trx);
        return res[0] || null;
    }

    async getUserByEmail(email) {
        const res = await this.findUsers({ email });
        return res[0] || null;
    }

    async getUserByCodeInstitute(code, institute_id) {
        const res = await this.findUsers({ code, institute_id });
        return res[0] || null;
    }

    async getUsersByFirstName(first_name, institute_id) {
        if (!first_name || !institute_id) {
            throw new Error("first_name and institute_id are required");
        }
        const rows = await this.findUsers({ first_name, institute_id });
        return rows; 
    }

    async getUsersByFullName(first_name, surname, institute_id) {
        const res = await this.findUsers({ first_name, surname, institute_id });
        return res[0] || null;
    }

    async getUsersByInstitute(institute_id) {
        if (!institute_id) {
            throw new Error("Institute ID is required to get users");
        }
        return this.findUsers({ institute_id });
    }

    async getUsersByInstituteRole(institute_role, institute_id) {
        return this.findUsers({ institute_role, institute_id });
    }

  
    async create(user) {
        let trx;
        try {
            trx = await this.db.transaction();

            if (!(user instanceof User)) {
                throw new Error("create() expects a User instance");
            }

            const data = user.toJSON();
            const { email, institute_id, code, first_name, surname, password, institute_role, sector_id } = data;

            const instituteExists = await this.instituteDAO.exists(institute_id, trx);
            if (!instituteExists) {
                throw new Error("Institute does not exist");
            }

            const userSameEmail = await trx('users').where({ email }).first();
            if (userSameEmail) {
                throw new Error('Email is already in use by another user');
            }

            if (code) {
                const userInstituteCode = await trx('users').where({ code, institute_id }).first();
                if (userInstituteCode) {
                    throw new Error('Code is already in use by another user in the same institute');
                }
            }

            if (surname) {
                const userSameFullName = await trx('users').where({ first_name, surname, institute_id }).first();
                if (userSameFullName) {
                    throw new Error('Complete name is already in use by another user in the same institute');
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [createdRow] = await trx('users')
                .insert({
                    code: code || null,
                    first_name,
                    surname: surname || null,
                    password_hash: hashedPassword,
                    email,
                    sector_id: sector_id || null,
                    institute_id,
                    institute_role: institute_role || null,
                    created_at: trx.fn.now(),
                    updated_at: trx.fn.now()
                })
                .returning('*');

            if (!createdRow) {
                throw new Error("Failed to create user");
            }

            await trx.commit();

            return new User({ ...createdRow });
        } catch (error) {
            if (trx) await trx.rollback();
            console.error('Error in create user:', error);
            throw error;
        }
    }

   
    async getPasswordHashById(id) {
        try {
            const row = await this.db('users').where({ id }).select('password_hash').first();
            if (!row) return null;
            return row.password_hash;
        } catch (error) {
            console.error("Error occurred in getPasswordHashById:", error);
            throw error;
        }
    }

    async getPasswordHashByEmail(email) {
        try {
            const row = await this.db('users').where({ email }).select('password_hash').first();
            if (!row) return null;
            return row.password_hash;
        } catch (error) {
            console.error("Error occurred in getPasswordHashByEmail:", error);
            throw error;
        }
    }

    async updatePassword(id, password) {
        let trx;
        try {
            trx = await this.db.transaction();

            const hashedPassword = await bcrypt.hash(password, 10);

            const [updatedRow] = await trx('users')
                .where({ id })
                .update({
                    password_hash: hashedPassword,
                    updated_at: trx.fn.now()
                })
                .returning('*');

            if (!updatedRow) {
                throw new Error('User not found or failed to update password');
            }

            await trx.commit();

            return new User({ ...updatedRow });
        } catch (error) {
            if (trx) await trx.rollback();
            console.error('Error in updatePassword:', error);
            throw error;
        }
    }


    
    async update(user) {
        let trx;
        try {
            trx = await this.db.transaction();

            if (!(user instanceof User)) {
                throw new Error('update() expects a User instance');
            }

            const data = user.toJSON();
            const { id, email, institute_id, code, first_name, surname } = data;

            const userSameEmail = await trx('users').where({ email }).whereNot({ id }).first();
            if (userSameEmail) {
                throw new Error('Email is already in use by another user');
            }

            if (code) {
                const userInstituteCode = await trx('users').where({ code, institute_id }).whereNot({ id }).first();
                if (userInstituteCode) {
                    throw new Error('Code is already in use by another user in the same institute');
                }
            }

            if (surname) {
                const userSameFullName = await trx('users').where({ first_name, surname, institute_id }).whereNot({ id }).first();
                if (userSameFullName) {
                    throw new Error('Complete name is already in use by another user in the same institute');
                }
            }

            const [updatedRow] = await trx('users')
                .where({ id })
                .update({
                    code: code || null,
                    first_name,
                    surname: surname || null,
                    email,
                    updated_at: trx.fn.now()
                })
                .returning('*');

            if (!updatedRow) {
                throw new Error('Failed to update user');
            }

            await trx.commit();

            return new User({ ...updatedRow });
        } catch (error) {
            if (trx) await trx.rollback();
            console.error('Error in update user:', error);
            throw error;
        }
    }

 
    async delete(id) {
        let trx;
        try {
            trx = await this.db.transaction();

            if (!id) {
                throw new Error('delete() requires a user id');
            }

            const result = await trx('users').where({ id }).del();

            if (result > 0) {
                await trx.commit();
                return true;
            } else {
                await trx.rollback();
                return false;
            }
        } catch (error) {
            if (trx) await trx.rollback();
            console.error('Error in delete user:', error);
            throw error;
        }
    }
}

module.exports = UserDAO;
/*
async function main() {
    const userDAO = new UserDAO(db);
    const instituteDAO = new InstituteDAO(db);

    try {
        console.log('=== GET INSTITUTE ===');
        const institute = (await instituteDAO.getInstitutes())[0];

        if (!institute) {
            throw new Error('No institute found. Create one before testing UserDAO.');
        }

        console.log('Using institute:', institute);

        console.log('\n=== CREATE USER ===');
        const user = new User({
            code: 'U001',
            first_name: 'John',
            surname: 'Doe',
            email: 'john.doe@test.com',
            password: 'secret123',
            institute_id: institute.id,
            institute_role: 'agent', // or manager / director
            sector_id: null
        });

        const created = await userDAO.create(user);
        console.log('Created:', created);

        console.log('\n=== GET USER BY ID ===');
        const byId = await userDAO.getUserById(created.id);
        console.log(byId);

        console.log('\n=== GET USER BY EMAIL ===');
        const byEmail = await userDAO.getUserByEmail('john.doe@test.com');
        console.log(byEmail);

        console.log('\n=== GET USER BY CODE + INSTITUTE ===');
        const byCodeInstitute = await userDAO.getUserByCodeInstitute('U001', institute.id);
        console.log(byCodeInstitute);

        console.log('\n=== GET USERS BY FIRST NAME ===');
        const byFirstName = await userDAO.getUsersByFirstName('John', institute.id);
        console.log(byFirstName);

        console.log('\n=== GET USERS BY FULL NAME ===');
        const byFullName = await userDAO.getUsersByFullName('John', 'Doe', institute.id);
        console.log(byFullName);

        console.log('\n=== GET USERS BY INSTITUTE ===');
        const byInstitute = await userDAO.getUsersByInstitute(institute.id);
        console.log(byInstitute);

        console.log('\n=== UPDATE USER ===');
        created.first_name = 'Johnny';
        created.surname = 'Doe Updated';
        created.email = 'johnny.doe@test.com';

        const updated = await userDAO.update(created);
        console.log(updated);

        console.log('\n=== UPDATE PASSWORD ===');
        const passwordUpdated = await userDAO.updatePassword(updated.id, 'newSecret123');
        console.log(passwordUpdated);

        console.log('\n=== GET PASSWORD HASH ===');
        const hashById = await userDAO.getPasswordHashById(updated.id);
        console.log('Password hash exists?', !!hashById);
        
        console.log('\n=== DELETE USER ===');
        const deleted = await userDAO.delete(updated.id);
        console.log('Deleted?', deleted);

        console.log('\n=== FIND AFTER DELETE ===');
        const afterDelete = await userDAO.getUserById(updated.id);
        console.log(afterDelete);

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await db.destroy(); // IMPORTANT: close knex connection
    }
}

main();*/




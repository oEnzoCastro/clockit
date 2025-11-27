const User = require('../models/user');
//const db = require('../database/db');
const InstituteDAO = require('./instituteDAO');
const bcrypt = require('bcrypt');


class UserDAO {
    constructor(db) {
        this.db = db;
        this.instituteDAO = new InstituteDAO(db); 
    }

    async getUserById(id,trx = this.db) {

        try {
            const row = await trx('users')
                .where({ id })
                .first();

            if (!row) {
                return null;
            }
            const roles = await trx('user_roles')
                .where({ user_id: id })
                .pluck('role');
            return new User({ ...row, roles });
        } catch (error) {
            console.error('Error in getUserById:' + error);
            throw error;
        }

    }


    async create(user) {
        const trx = await this.db.transaction();
        try {
            if (!(user instanceof User)) {
                throw new Error("create() expects a User instance");
            }


            const data = user.toJSON();
            const { email, institute_id, code, first_name, surname, password_hash } = data;


           

            const instituteExists = await this.instituteDAO.exists(institute_id);
            if (!instituteExists) {
                throw new Error("Institute does not exist");
            }

         
            const userSameEmail = await trx('users')
                .where({ email })
                .first();

            if (userSameEmail) {
                throw new Error('Email is already in use by another user');
            }

            if (code) {
                const userInstituteCode = await trx('users')
                    .where({ code, institute_id })
                    .first();

                if (userInstituteCode) {
                    throw new Error('Code is already in use by another user in the same institute');
                }
            }

            if (surname) {
                const userSameFullName = await trx('users')
                    .where({ first_name, surname, institute_id })
                    .first();

                if (userSameFullName) {
                    throw new Error('Complete name is already in use by another user in the same institute');
                }
            }

            
            const hashedPassword = await bcrypt.hash(password_hash, 10);

            
            const [createdRow] = await trx('users')
                .insert({
                    code: code || null,
                    first_name,
                    surname: surname || null,
                    password_hash: hashedPassword,
                    email,
                    institute_id,
                    created_at: trx.fn.now(),
                    updated_at: trx.fn.now()
                })
                .returning('*');

            if (!createdRow) {
                throw new Error("Failed to create user");
            }

           
            if (Array.isArray(user.roles) && user.roles.length > 0) {
                const roleInserts = user.roles.map(role => ({
                    user_id: createdRow.id,
                    role,
                }));
                await trx('user_roles').insert(roleInserts);
            }

            await trx.commit();

            return new User({
                ...createdRow,
                roles: user.roles || []
            });

        } catch (error) {
            await trx.rollback();
            console.error('Error in create user' + error);
            throw error;
        }
    }



    async getPasswordHashById(id) {
        const trx = await this.db.transaction();
        try {
            if (id == null || id == undefined) {
                throw new Error("Id cannot be null or undefined");
            }

            const row = await trx('users')
                .where({ id })
                .select('password_hash')
                .first();

            if (!row) {
                await trx.rollback();
                return null;
            }

            await trx.commit();
            return row.password_hash;
        } catch (error) {
            await trx.rollback();
            console.error("Error occurred in getPasswordHashById:", error);
            throw error;
        } finally {
            if (!trx.isCompleted()) {
                await trx.rollback();
            }
        }
    }


     async getPasswordHashById(email) {
        const trx = await this.db.transaction();
        try {
            if (email == null || email == undefined) {
                throw new Error("email cannot be null or undefined");
            }

            const row = await trx('users')
                .where({ email })
                .select('password_hash')
                .first();

            if (!row) {
                await trx.rollback();
                return null;
            }

            await trx.commit();
            return row.password_hash;
        } catch (error) {
            await trx.rollback();
            console.error("Error occurred in getPasswordHashByEmail:", error);
            throw error;
        } finally {
            if (!trx.isCompleted()) {
                await trx.rollback();
            }
        }
    }

    async updatePassword(id, password) {
        const trx = await this.db.transaction();

        try {
            if (id == null || id == undefined) {
                throw new Error('Id cannot be undefined or null');
            }
            if (password == null || password == undefined) {
                throw new Error('Password cannot be undefined or null');
            }

            const hashedPassword = await bcrypt.hash(password, 10);


            const [updatedRow] = await trx('users')
                .where({ id })
                .update({
                    password_hash: hashedPassword,
                    updated_at: trx.fn.now()
                })
                .returning('*');

            if (!updatedRow) {
                await trx.rollback();
                throw new Error('User not found or failed to update password');
            }


            const roles = await trx('user_roles')
                .where({ user_id: id })
                .select('role')
                .pluck('role');


            await trx.commit();


            return new User({
                ...updatedRow,
                roles
            });

        } catch (error) {
            await trx.rollback();
            console.error('Error in updatePassword:' + error);
            throw error;
        }
    }


    async update(user) {
        const trx = await this.db.transaction();

        try {
            if (!(user instanceof User)) {
                throw new Error('update() expects a User instance');
            }

            const data = user.toJSON();
            const { id, email, institute_id, code, first_name, surname } = data;

            if (!id) {
                throw new Error('User must have an id');
            }

            if (!email) {
                throw new Error('User must have an email');
            }

            if (!institute_id) {
                throw new Error('User must have an institute_id');
            }

            if (!first_name) {
                throw new Error('User must have an first_name');
            }



            const userSameEmail = await trx('users')
                .where({ email })
                .whereNot({ id }) 
                .first();
            if (userSameEmail) {
                throw new Error('Email is already in use by another user');
            }

            if (code) {
                const userInstituteCode = await trx('users')
                    .where({ code, institute_id })
                    .whereNot({ id })
                    .first();
                if (userInstituteCode) {
                    throw new Error('Code is already in use by another user in the same institute');
                }
            }

            if (surname) {
                const userSameFullName = await trx('users')
                    .where({ first_name, surname, institute_id })
                    .whereNot({ id }) 
                    .first();
                if (userSameFullName) {
                    throw new Error('Complete name is already in use by another user in the same institute');
                }
            }


           
            const [updatedRow] = await trx('users')
                .where({ id })
                .update({
                    code: code || null,
                    first_name: first_name,
                    surname: surname || null,
                    email: email,
                    updated_at: trx.fn.now()
                })
                .returning('*');

            if (!updatedRow) {
                throw new Error('Failed to update user');
            }

            
            const existingRoles = await trx('user_roles')
                .where({ user_id: id })
                .pluck('role');

            const newRoles = Array.isArray(user.roles) ? user.roles : [];

            const rolesToAdd = newRoles.filter(role => !existingRoles.includes(role));
            const rolesToRemove = existingRoles.filter(role => !newRoles.includes(role));

            if (rolesToAdd.length > 0) {
                await trx('user_roles').insert(
                    rolesToAdd.map(role => ({ user_id: id, role }))
                );
            }

            if (rolesToRemove.length > 0) {
                await trx('user_roles')
                    .where({ user_id: id })
                    .whereIn('role', rolesToRemove)
                    .del();
            }

            const roles = await trx('user_roles')
                .where({ user_id: id })
                .pluck('role');

            await trx.commit();

            return new User({
                ...updatedRow,
                roles
            });

        } catch (error) {
            await trx.rollback();
            console.error('Error in update user' + error);
            throw error;
        }
    }



    async delete(id) {
        const trx = await this.db.transaction();
        try {
            if (!id) {
                throw new Error('delete() requires a user id');
            }

            const result = await trx('users')
                .where({ id })
                .del();

            if (result > 0) {
                await trx.commit();
                return true;
            } else {
                await trx.rollback();
                return false;
            }
        } catch (error) {
            await trx.rollback();
            console.error('Error in delete user:' + error);
            throw error;
        }
    }

    async getUserByCodeInstitute(code, institute_id) {
        try {
            const row = await this.db('users')
                .where({ institute_id, code })
                .first();

            if (!row) {
                return null;
            }

            const roles = await this.db('user_roles')
                .where({ user_id: row.id })
                .pluck('role');

            const user = new User({
                ...row,
                roles
            });

            return user;

        } catch (error) {
            console.error('Error in getUserByCodeInstitute: ' + error);
            throw error;
        }
    }

    async getUsersByFirstName(first_name, institute_id) {


        try {
            if (!first_name || !institute_id) {
                throw new Error("first_name and institute_id are required");
            }

            const rows = await this.db("users").where({ first_name, institute_id });

            if (!rows || rows.length === 0) {
                return [];
            }

            const users = [];

            for (const row of rows) {
                const roles = await this.db("user_roles")
                    .where({ user_id: row.id })
                    .pluck("role");

                const user = new User({
                    ...row,
                    roles: roles || []
                });

                users.push(user);
            }


            return users;

        } catch (error) {

            console.error("Error in getUsersByFirstName:" + error);
            throw error;
        }
    }

    async getUsersByFullName(first_name, surname, institute_id) {


        try {
            if (!first_name || !institute_id) {
                throw new Error("first_name and institute_id are required");
            }

            const rows = await this.db("users").where({ first_name, surname, institute_id }).first();

            if (!rows || rows.length === 0) {
                return [];
            }

            const users = [];

            for (const row of rows) {
                const roles = await this.db("user_roles")
                    .where({ user_id: row.id })
                    .pluck("role");

                const user = new User({
                    ...row,
                    roles: roles || []
                });

                users.push(user);
            }


            return users;

        } catch (error) {

            console.error("Error in getUsersByFullName:" + error);
            throw error;
        }
    }


    async getUserByEmail(email) {

        try {
            if (!email) {
                throw new Error("Email is required to get user");
            }

            const row = await this.db('users')
                .where({ email })
                .first();
            if (!row) {
                return null;
            }
            const roles = await this.db('user_roles')
                .where({ user_id: row.id })
                .pluck('role');
            return new User({
                ...row,
                roles
            });

        } catch (error) {
            console.error('Error in getUserByEmail:' + error);
            throw error;
        }
    }


    async getUsersByInstitute(institute_id) {
        const trx = await this.db.transaction();

        try {
            if (!institute_id) {
                throw new Error("Institute ID is required to get users");
            }

            
            const rows = await trx("users").where({ institute_id });

            if (!rows || rows.length === 0) {
                await trx.rollback();
                return [];
            }

            const users = [];

            for (const row of rows) {
                const roles = await trx("user_roles")
                    .where({ user_id: row.id })
                    .pluck("role");

                const user = new User({
                    ...row,
                    roles: roles || []
                });

                users.push(user);
            }

            await trx.commit();
            return users;

        } catch (error) {
            await trx.rollback();
            console.error("Error in getUsersByInstitute:" + error);
            throw error;

        }
    }


}

module.exports = UserDAO;





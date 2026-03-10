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
                area_id
            } = filters;



            const query = trx('users')
                .leftJoin('area', 'users.area_id', 'area.id')
                .select(
                    'users.*',
                    'area.id as area_id',
                    'area.area_name as area_name',
                    'area.acronym as area_acronym'
                );


            if (id) query.where('users.id', id);
            if (area_id) query.where('users.area_id', area_id);

            if (institute_id || area_id) {
                query.where('users.institute_id', institute_id);
                if (email) query.where('users.email', email);
                if (first_name) query.where('users.first_name', first_name);
                if (surname) query.where('users.surname', surname);
                if (code) query.where('users.code', code);
                if (institute_role) query.where('users.institute_role', institute_role);
            }

            const rows = await query;


            return rows.map(r => new User({
                ...r,
                area: r.area_id ? {
                    id: r.area_id,
                    name: r.area_name,
                    acronym: r.area_acronym
                } : null
            }));
        } catch (error) {
            console.error('Error in findUsers():', error);
            throw error;
        }
    }




    async getUserById(id, trx = this.db) {
        const res = await this.findUsers({ id }, trx);
        return res[0] || null;
    }

    async getUserByEmail(email,institute_id) {
        const res = await this.findUsers({ email,institute_id });
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
            let area_id = null;

            const data = user.toJSON();
            const { email, institute_id, code, first_name, surname, password, institute_role, area } = data;
            if (area) {
                area_id = area.id;
            }

            const instituteExists = await this.instituteDAO.exists(institute_id, trx);
            if (!instituteExists) {
                throw new Error("Institute does not exist");
            }

            const userSameEmail = await trx('users').where({ email,institute_id }).first();
            if (userSameEmail) throw new Error('Email is already in use');

            if (code) {
                const userCode = await trx('users').where({ code, institute_id }).first();
                if (userCode) throw new Error('Code already in use in this institute');
            }

            if (surname) {
                const userFullName = await trx('users').where({ first_name, surname, institute_id }).first();
                if (userFullName) throw new Error('Full name already in use in this institute');
            }

            const hashedPassword = await bcrypt.hash(password, 10);


            const [createdRow] = await trx('users')
                .insert({
                    code: code || null,
                    first_name,
                    surname: surname || null,
                    password_hash: hashedPassword,
                    email,
                    area_id: area_id || null,
                    institute_id,
                    institute_role: institute_role || null,
                    created_at: trx.fn.now(),
                    updated_at: trx.fn.now()
                })
                .returning('*');

            if (!createdRow) throw new Error("Failed to create user");


            let userArea = null;
            if (createdRow.area_id) {
                const areaRow = await trx('area')
                    .select('id', 'area_name', 'acronym')
                    .where('id', createdRow.area_id)
                    .first();

                if (areaRow) {
                    userArea = {
                        id: areaRow.id,
                        name: areaRow.area_name,
                        acronym: areaRow.acronym
                    };
                }
            }

            await trx.commit();


            return new User({ ...createdRow, area: userArea });

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
            const { id, email, institute_id, code, first_name, surname, area, institute_role } = data;

            // fetch current row to use existing institute_id if none provided
            const existingRow = await trx('users').where({ id }).first();
            if (!existingRow) throw new Error('User not found');

            const effectiveInstituteId = institute_id || existingRow.institute_id;

            
            

           
            const userSameEmail = await trx('users').where({ email }).whereNot({ id }).first();
            if (userSameEmail) {
                throw new Error('Email is already in use by another user');
            }

            
            if (code) {
                const userInstituteCode = await trx('users')
                    .where({ code, institute_id: effectiveInstituteId })
                    .whereNot({ id })
                    .first();
                if (userInstituteCode) {
                    throw new Error('Code is already in use by another user in the same institute');
                }
            }


            if (surname) {
                const userSameFullName = await trx('users')
                    .where({ first_name, surname, institute_id: effectiveInstituteId })
                    .whereNot({ id })
                    .first();
                if (userSameFullName) {
                    throw new Error('Complete name is already in use by another user in the same institute');
                }
            }

            let area_id = null;
            if (area) area_id = area.id;

            const updateData = {
                code: code || null,
                first_name,
                surname: surname || null,
                email,
                updated_at: trx.fn.now()
            };


            if (area !== undefined) updateData.area_id = area_id || null;

            const [updatedRow] = await trx('users')
                .where({ id })
                .update(updateData)
                .returning('*');

            if (!updatedRow) {
                throw new Error('Failed to update user');
            }


            let userArea = null;
            if (updatedRow.area_id) {
                const areaRow = await trx('area')
                    .select('id', 'area_name', 'acronym')
                    .where('id', updatedRow.area_id)
                    .first();

                if (areaRow) {
                    userArea = {
                        id: areaRow.id,
                        name: areaRow.area_name,
                        acronym: areaRow.acronym
                    };
                }
            }

            await trx.commit();

            return new User({ ...updatedRow, area: userArea });
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
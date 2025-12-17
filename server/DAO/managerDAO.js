const UserDAO = require('./userDAO');
const AreaDAO = require('./areaDAO');
const User = require('../models/user');
const AreaManager = require('../models/areaManager');

class ManagerDAO extends UserDAO {
    constructor(db) {
        super(db);
        this.areaDAO = new AreaDAO(db);
    }

    async findManagers(filters = {}, trx = this.db) {
        try {
            const {
                id,
                email,
                first_name,
                surname,
                institute_id,
                code,
                area_id
            } = filters;

           
            let query = trx('users')
                .where({ institute_role: 'manager' });

            if (id) query.where('users.id', id);
            if (email) query.where('users.email', email);
            if (institute_id && first_name) query.where('users.first_name', first_name);
            if (institute_id && surname) query.where('users.surname', surname);
            if (institute_id) query.where('users.institute_id', institute_id);
            if (code) query.where('users.code', code);

            
            if (area_id) {
                query = query
                    .join('manager_area', 'users.id', 'manager_area.manager_id')
                    .where('manager_area.area_id', area_id);
            }

            const rows = await query;
            return rows.map(row => new User(row));

        } catch (error) {
            console.error('Error in findManagers():', error);
            throw error;
        }
    }

 
    async getManagerById(id) {
        const res = await this.findManagers({ id });
        return res[0] || null;
    }

    async getManagersByInstitute(institute_id) {
        return this.findManagers({ institute_id });
    }

    async getManagersByArea(area_id) {
        return this.findManagers({ area_id });
    }

    async getManagerByCodeInstitute(code, institute_id) {
        const res = await this.findManagers({ code, institute_id });
        return res[0] || null;
    }

    async create(manager) {
        if (!(manager instanceof User)) {
            throw new Error("create() expects a User instance");
        }

        manager.institute_role = 'manager';
        return super.create(manager);
    }

    
    async assignManagerToArea(manager_id, area_id) {
        let trx;
        try {
            trx = await this.db.transaction();

            const manager = await this.getManagerById(manager_id);
            if (!manager) {
                throw new Error("Manager not found");
            }

            const area = await this.areaDAO.getAreaById(area_id, trx);
            if (!area) {
                throw new Error("Area not found");
            }

            const exists = await trx('manager_area')
                .where({ manager_id, area_id })
                .first();

            if (exists) {
                throw new Error("Manager already assigned to this area");
            }

            await trx('manager_area').insert({ manager_id, area_id });

            await trx.commit();
            return new AreaManager(manager_id, area_id);

        } catch (error) {
            if (trx) await trx.rollback();
            console.error("Error in assignManagerToArea:", error);
            throw error;
        }
    }


    async removeManagerFromArea(manager_id, area_id) {
        let trx;
        try {
            trx = await this.db.transaction();

            const deleted = await trx('manager_area')
                .where({ manager_id, area_id })
                .del();

            if (deleted > 0) {
                await trx.commit();
                return true;
            }

            await trx.rollback();
            return false;

        } catch (error) {
            if (trx) await trx.rollback();
            console.error("Error in removeManagerFromArea:", error);
            throw error;
        }
    }
}

module.exports = ManagerDAO;

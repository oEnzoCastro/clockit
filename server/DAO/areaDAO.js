const Area = require('../models/area');
const InstituteDAO = require('./instituteDAO');
const db = require('../database/db');

class AreaDAO {
    constructor(db) {
        this.db = db;
        this.instituteDAO = new InstituteDAO(db);
    }


    async create(area) {
        const trx = await this.db.transaction();
        try {
            if (!(area instanceof Area)) {
                throw new Error("area must be an instance of Area");
            }
            const { institute_id, acronym, area_name, max_workload, is_hidden } = area.toJSON();

            if (max_workload && max_workload < 0) {
                throw new Error("Max_workload cannot be negative");
            }

            const instituteExists = await this.instituteDAO.exists(institute_id);
            if (!instituteExists) {
                throw new Error("Institute does not exist");
            }

            const existing = await trx('area')
                .where({ institute_id })
                .where(function () {
                    this.where('acronym', acronym).orWhere('area_name', area_name);
                })
                .first();

            if (existing) {
                if (existing.acronym === acronym) {
                    throw new Error("Cannot create an area with the same acronym in the same institute");
                }
                if (existing.area_name === area_name) {
                    throw new Error("Cannot create an area with the same name in the same institute");
                }
            }

            const [createdArea] = await trx('area').insert({ institute_id, acronym, area_name, is_hidden: is_hidden || false }).returning('*');

            if (!createdArea) {
                await trx.rollback();
                return null;
            }

            await trx.commit();
            return new Area(createdArea);

        } catch (error) {
            await trx.rollback();
            console.error('Error in create() area: ' + error);
            throw error;
        }
    }


    async findAreas(filters = {}, trx = this.db) {
        try {
            const { id, acronym, area_name, institute_id, manager_id } = filters;
            const query = trx('area');

            if (id) {
                query.where({ id });
            }
            if (manager_id) {
                query
                    .join('manager_area as ma', 'ma.area_id', 'a.id')
                    .where('ma.manager_id', manager_id);
            }

            if (institute_id) {
                query.where({ institute_id });

                if (acronym) {
                    query.where({ acronym });
                }

                if (area_name) {
                    query.where({ area_name });

                }
            }

            const rows = await query;
            return rows.map(row => new Area(row));

        } catch (error) {
            console.error('Error in findAreas():', error);
            throw error;
        }
    }


    async getAreaById(id) {
        const res = await this.findAreas({ id });
        return res[0] || null;
    }

    async getByAcronymInstitute(acronym, institute_id) {
        const res = await this.findAreas({ acronym, institute_id });
        return res[0] || null;
    }

    async getByNameInstitute(area_name, institute_id) {
        const res = await this.findAreas({ area_name, institute_id });
        return res[0] || null;
    }

    async getAreasByInstitute(institute_id) {
        return this.findAreas({ institute_id });
    }


    async update(area) {
        const trx = await this.db.transaction();
        try {
            const { id, area_name, institute_id, acronym, max_workload, is_hidden } = area.toJSON();


            const existing = await trx('area')
                .where({ institute_id })
                .where(function () {
                    this.where('acronym', acronym).orWhere('area_name', area_name);
                })
                .andWhereNot({ id })
                .first();

            if (existing) {
                if (existing.acronym === acronym) {
                    throw new Error("Cannot create an area with the same acronym in the same institute");
                }
                if (existing.area_name === area_name) {
                    throw new Error("Cannot create an area with the same name in the same institute");
                }
            }

            const [updatedArea] = await trx('area').where({ id }).update({ area_name, institute_id, acronym, max_workload: max_workload, is_hidden }).returning('*');

            if (!updatedArea) {
                return null;
            }

            await trx.commit();
            return new Area(updatedArea);

        } catch (error) {
            await trx.rollback();
            console.error('Error in update() area: ' + error);
            throw error;
        }
    }

    async delete(id) {
        const trx = await this.db.transaction();
        try {
            if (!id) {
                throw new Error("delete() needs an id");
            }
            const result = await trx('area').where({ id }).del();

            if (result > 0) {
                await trx.commit();
                return true;
            } else {
                await trx.rollback();
                return false;
            }

        } catch (error) {
            await trx.rollback();
            console.error('Error in delete() area: ' + error);
            throw error;
        }
    }

    async getAreasByManager(manager_id) {
        try {
            const managerAreas = await this.db('manager_area').where({ manager_id });

            if (!managerAreas || managerAreas.length === 0) {
                return [];
            }

            const areas = await Promise.all(
                managerAreas.map(ma => this.getAreaById(ma.area_id))
            );

            console.log('Areas fetched successfully for manager:', manager_id);
            return areas;

        } catch (error) {
            console.error("Error in getAreasByManager:", error);
            throw error;
        }
    }

    async updateHiddenArea(id, hidden = true) {
        const trx = await this.db.transaction();
        try {
            const [updated] = await trx('area')
                .where({ id })
                .update({ is_hidden: hidden })
                .returning('*');

            if (!updated) {
                throw new Error("Could not update area or area does not exist");
            }

            await trx.commit();
            return updated;

        } catch (error) {
            await trx.rollback();
            console.error("Error in updateHiddenArea:", error);
            throw error;
        }
    }
}


module.exports = AreaDAO;

const db = require('../database/db');
const Area = require('../models/area');
const Institute = require('../models/institute');
const InstituteDAO = require('./instituteDAO');

class AreaDAO {
    constructor() {
        this.db = db;
    }



    async create(area) {
        const trx = await this.db.transaction();
        try {
            const instituteDAO = new InstituteDAO();
            if (!(area instanceof Area)) {
                throw new Error("area must be an instance of Area");
            }
            const { institute_id, acronym, area_name, max_workload, is_hidden } = area.toJSON();

            if (!institute_id) {
                throw new Error("area must contain institute_id");
            }
            if (!acronym) {
                throw new Error("area must contain acronym");
            }
            if (!area_name) {
                throw new Error("area must contain area_name");
            }
            if (max_workload && max_workload < 0) {
                throw new Error("Max_workload cannot be negative");
            }


            const instituteExists = await instituteDAO.exists(institute_id);
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

    async getById(id) {
        try {
            if (!id) {
                throw new Error("Id not found");
            }
            const area = await this.db('area').where({ id }).first();
            if (!area) {
                return null;
            }
            return new Area(area);
        } catch (error) {
            console.error('Error in getById area: ' + error);
            throw error;
        }
    }

    async getByAcronymInstitute(acronym, institute_id) {
        try {
            if (!acronym) {
                throw new Error("Acronym cannot be null or undefined");
            }
            if (!institute_id) {
                throw new Error("institute_id cannot be null or undefined");
            }
            const [area] = await this.db('area').where({ acronym, institute_id });

            if (!area) {
                return null;
            }

            return new Area(area);

        } catch (error) {
            console.error('Error in getByAcronymInstitute area: ' + error);
            throw error;
        }
    }

    async getByNameInstitute(area_name, institute_id) {
        try {
            if (!area_name) {
                throw new Error("area_name cannot be null or undefined");
            }
            if (!institute_id) {
                throw new Error("institute_id cannot be null or undefined");
            }
            const [area] = await this.db('area').where({ area_name, institute_id });

            if (!area) {
                return null;
            }

            return new Area(area);

        } catch (error) {
            console.error('Error in getByNameInstitute area: ' + error);
            throw error;
        }
    }

    async update(area) {
        const trx = await this.db.transaction();
        try {
            const { id, area_name, institute_id, acronym, max_workload, is_hidden } = area.toJSON();

            if (!id) {
                throw new Error("update() needs id");
            }

            if (!area_name) {
                throw new Error("update() needs area_name");
            }
            if (!acronym) {
                throw new Error("update() needs acronym");
            }
            if (!institute_id) {
                throw new Error("update() needs institute_id");
            }
            if (max_workload && max_workload < 0) {
                throw new Error("Max_workload cannot be negative");
            }

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
                throw new Error("Falied to update area or area not found");
            }

            return new Area(updatedArea);
        } catch (error) {
            await trx.rollback();
            console.error('Error in update() area: ' + error);
            throw error;
        }
    }


    async getAreasByInstitute(institute_id){
        try {
            if(!institute_id){
                throw new Error("Must have an institute id in getAreasbyInstitute");
                
            }
            const rows = await this.db('area').where({institute_id});
            if (!rows || rows.length <= 0) {
                return null;
            }
            const areas = rows.map(s=>new Area(s));
            return areas;

        } catch (error) {
            console.error('Error in getAreasByInstitute area: ' + error);
            throw error;
        }
    }

    async delete(id){
        const trx = await this.db.transaction();
        try {
            if(!id){
                throw new Error("delete() needs a id");
            }
            const result = await trx('area').where({id}).del();

            if(result>0){
                await trx.commit();
                return true;
            }else{
                await trx.rollback();
                return false;
            }

        } catch (error) {
            await trx.rollback();
            console.error('Error in delete() area: ' + error);
            throw error;
        }
    }

}
/*
async function main() {
    const areaDAO = new AreaDAO(db);

    // Example data for the new area
    const newAreaData = {
        
        institute_id: '3a2ad40e-c63d-48ee-baf1-bf56081edd25',
        acronym: 'ES',
        area_name: 'Engenharia de Software',
        max_workload: 200,
        is_hidden: false
    };

    const area = new Area(newAreaData);

    try {
        const createdArea = await areaDAO.delete('f0f5cb3c-6541-4b2e-9d94-c059981d6556');
        console.log('Area created successfully:');
        console.log(createdArea);
    } catch (error) {
        console.error('Failed to create area:', error);
    } finally {
        // Close DB connection if needed
        await db.destroy();
    }
}

// Execute the main function
main();*/


module.exports = AreaDAO;
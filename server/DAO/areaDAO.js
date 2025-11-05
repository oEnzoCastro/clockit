const db = require('../database/db');
const Area = require('../models/area');
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
            const {institute_id, acronym, area_name,max_workload} = area.toJSON();

            if(!institute_id){
                throw new Error("area must contain institute_id");  
            }
            if(!acronym){
                throw new Error("area must contain acronym");  
            }
            if(!area_name){
                throw new Error("area must contain area_name");  
            }
            
            const instituteExist = await instituteDAO.exists(institute_id, trx);
            if(!instituteExist){
                throw new Error("Institute does not exists");
            }

            const existingAcronym = await trx('area').where({acronym,institute_id}).first();
            const existingAreaName = await trx('area').where({area_name,institute_id}).first();

            if(existingAcronym){
                throw new Error("Cannot create an area with the same acronym in the same institute");
            }
            if(existingAreaName){
                throw new Error("Cannot create an area with the same name in the same institute");
            }


            const [createdArea] = await trx('area').insert({institute_id, acronym, area_name}).returning('*');

            if(!createdArea){
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

    async getByAcronymInstitute(acronym,institute_id){
        try {
            if(!acronym){
                throw new Error("Acronym cannot be null or undefined");
            }
            if(!institute_id){
                throw new Error("institute_id cannot be null or undefined");
            }
            const [area] = await this.db('area').where({acronym,institute_id});

            if(!area){
                return null;
            }

            return new Area(area);

        } catch (error) {
            console.error('Error in getByAcronymInstitute area: ' + error);
            throw error;
        }
    }

    async getByNameInstitute(area_name,institute_id){
        try {
            if(!area_name){
                throw new Error("area_name cannot be null or undefined");
            }
            if(!institute_id){
                throw new Error("institute_id cannot be null or undefined");
            }
            const [area] = await this.db('area').where({area_name,institute_id});

            if(!area){
                return null;
            }

            return new Area(area);

        } catch (error) {
            console.error('Error in getByNameInstitute area: ' + error);
            throw error;
        }
    }

    

}

async function main() {
    // 1️⃣ Initialize DB connection
    const areaDAO = new AreaDAO();

    try {
        // 2️⃣ Create a new Area instance
        const newArea = new Area({
            institute_id: '6caa566a-f935-42c3-9d70-79a68aedfad4',
            acronym: 'HR',
            area_name: 'Human Resources'
        });

        // 3️⃣ Insert the area into the DB
        const createdArea = await areaDAO.getByNameInstitute('Human Resources','6caa566a-f935-42c3-9d70-79a68aedfad4');

        if (createdArea) {
            console.log('Area created successfully:', createdArea);
        } else {
            console.log('Failed to create area.');
        }

    } catch (error) {
        console.error('Error creating area:', error.message);
    } finally {
        // 4️⃣ Close DB connection
        await db.destroy();
    }
}

// 5️⃣ Run the test
main();
const db = require('../database/db');
const Institute = require("../models/institute")


class InstituteDAO {
    constructor() {
        this.db = db;
    }

    async create(institute) {
        const trx = await this.db.transaction();

        try {
            // ✅ The instanceof check was reversed
            if (!(institute instanceof Institute)) {
                throw new Error("institute must be an instance of Institute");
            }

            const { acronym, institute_name } = institute.toJSON();

            if (!acronym) {
                throw new Error("Acronym is required to create institute");
            }
            if (!institute_name) {
                throw new Error("Institute name is required to create institute");
            }

            // ✅ Check for duplicates
            const existingInstituteAcronym = await trx('institute')
                .where({ acronym })
                .first();
            const existingInstituteName = await trx('institute')
                .where({ institute_name })
                .first();

            if (existingInstituteAcronym) {
                throw new Error("This acronym is already used by another institute");
            }
            if (existingInstituteName) {
                throw new Error("This name is already used by another institute");
            }

            // ✅ Perform insert and return the created row
            const [createdInstitute] = await trx('institute')
                .insert({ acronym, institute_name })
                .returning('*');

            await trx.commit();

            return new Institute(createdInstitute);
        } catch (error) {
            await trx.rollback();
            console.error('Error in create institute:', error);
            throw error;
        } 
    }


    async getInstitutes() {

        try {
            const rows = await this.db('institute');
            if (!rows || rows.length <= 0) {
                return null;
            }
            const institutes = rows.map(s => new Institute(s));

            return institutes;
        } catch (error) {
            console.error('Error in create institute' + error);
            throw error;
        }
    }

    async getInstitutebyAcronym(acronym) {
        try {
            const institute = await this.db('institute').where({ acronym }).first();
            if (!institute) {
                return null;
            }
            return new Institute(institute);
        } catch (error) {
            console.error('Error in getInstitutebyAcronym' + error);
            throw error;
        }
    }

    async getInstitutebyId(id) {
        try {
            const institute = await this.db('institute').where({ id }).first();
            if (!institute) {
                return null;
            }
            return new Institute(institute);
        } catch (error) {
            console.error('Error in getInstitutebyId' + error);
            throw error;
        }
    }

    async exists(id, trx = this.db) {
        try {
            const institute = await trx('institute')
                .where({ id })
                .first();
            return institute? true:false;
        } catch (error) {
            console.error('Error in exists(): ' + error);
            throw error;
        }
    }

    async getInstitutebyName(institute_name) {
        try {
            const institute = this.db('institute').where({ institute_name }).first();
            if (!institute) {
                return null;
            }
            return new Institute(institute);
        } catch (error) {
            console.error('Error in getInstitutebyName' + error);
            throw error;
        }
    }



    async delete(id) {
        const trx = await this.db.transaction();
        try {
            if (!id) {
                throw new Error("delete() requires institute id");

            }
            const result = await trx('institute').where({ id }).del();
         
            
            if(result>0){
                await trx.commit();
                return true;
            }else{
                await trx.rollback();
                return false;
            }

        } catch (error) {
            await trx.rollback();
            console.error('Error in deleting institute' + error);
            throw error;
        }
    }

    async update(institute) {
        const trx = await db.transaction();
        try {

            const { id, acronym, institute_name } = institute.toJSON();

            if (!(institute instanceof Institute)) {
                throw new Error("institute must be an instance of Institute");
            }

            if (!id) {
                throw new Error("institute ID is required to update institute");
            }

            if (!acronym) {
                throw new Error("institute acronym is required to update institute");
            }
            if (!institute_name) {
                throw new Error("institute institute_name is required to update institute");
            }

            const existingInsituteAcronym = await trx('institute').where({ acronym }).whereNot({ id }).returning('*').first();
            const existingInsituteName = await trx('institute').where({ institute_name }).whereNot({ id }).returning('*').first();

            if (existingInsituteAcronym) {
                throw new Error("This acronym is already used by another institute");
            }
            if (existingInsituteName) {
                throw new Error("This name is already used by another institute");
            }

            const [updatedInstitute] = await trx('institute').where({ id }).update({ acronym, institute_name }).returning('*');

            if (!updatedInstitute) {
                throw new Error("Failed in updating institute or no user found");
            }

            await trx.commit();
            return updatedInstitute;

        } catch (error) {
            await trx.rollback();
            console.error('Error in updating institute' + error);
            throw error;
        }
    }


}

/*async function main() {
    const instituteDAO = new InstituteDAO(db);

    // Example data for a new institute
    const newInstituteData = {
         // optional, can let DB generate if UUID default is set
        acronym: 'PUC',
        institute_name: 'Pontificia Universidade Catolica'
    };

    const institute = new Institute(newInstituteData);

    try {
        const createdInstitute = await instituteDAO.create(institute);
        console.log('Institute created successfully:');
        console.log(createdInstitute);
    } catch (error) {
        console.error('Failed to create institute:', error);
    } finally {
        // Close DB connection if needed
        await db.destroy();
    }
}

// Execute the main function
main();*/

module.exports = InstituteDAO;


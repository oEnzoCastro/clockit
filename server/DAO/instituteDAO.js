const Institute = require("../models/institute");
const db = require('../database/db');

class InstituteDAO {
    constructor(db) {
        this.db = db;
    }

    async create(institute) {
        const trx = await this.db.transaction();
        try {
            if (!(institute instanceof Institute)) {
                throw new Error("institute must be an instance of Institute");
            }

            const { acronym, institute_name } = institute.toJSON();

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

    async findInstitutes(filters = {}, trx = this.db) {
        try {
            const { id, acronym, institute_name } = filters;

            const query = trx('institute');

            if (id) query.where({ id });
            if (acronym) query.where({ acronym });
            if (institute_name) query.where({ institute_name });

            const rows = await query;
            return rows.map(row => new Institute(row));

        } catch (error) {
            console.error('Error in findInstitutes():', error);
            throw error;
        }
    }

 
    async getInstitutes() {
        return this.findInstitutes();
    }

    async getInstitutebyId(id) {
        const res = await this.findInstitutes({ id });
        return res[0] || null;
    }

    async getInstitutebyAcronym(acronym) {
        const res = await this.findInstitutes({ acronym });
        return res[0] || null;
    }

    async getInstitutebyName(institute_name) {
        const res = await this.findInstitutes({ institute_name });
        return res[0] || null;
    }

    
    async exists(id, trx = this.db) {
        try {
            const institute = await trx('institute')
                .where({ id })
                .first();
            return !!institute;
        } catch (error) {
            console.error('Error in exists():', error);
            throw error;
        }
    }

    async delete(id) {
        const trx = await this.db.transaction();
        try {
            if (!id) {
                throw new Error("delete() requires institute id");
            }

            const result = await trx('institute')
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
            console.error('Error in deleting institute', error);
            throw error;
        }
    }

   
    async update(institute) {
        const trx = await this.db.transaction();
        try {
            if (!(institute instanceof Institute)) {
                throw new Error("institute must be an instance of Institute");
            }

            const { id, acronym, institute_name } = institute.toJSON();

           

            const existingInsituteAcronym = await trx('institute')
                .where({ acronym })
                .whereNot({ id })
                .first();

            const existingInsituteName = await trx('institute')
                .where({ institute_name })
                .whereNot({ id })
                .first();

            if (existingInsituteAcronym) {
                throw new Error("This acronym is already used by another institute");
            }
            if (existingInsituteName) {
                throw new Error("This name is already used by another institute");
            }

            const [updatedInstitute] = await trx('institute')
                .where({ id })
                .update({ acronym, institute_name })
                .returning('*');

            if (!updatedInstitute) {
                throw new Error("Failed in updating institute or no institute found");
            }

            await trx.commit();
            return new Institute(updatedInstitute);

        } catch (error) {
            await trx.rollback();
            console.error('Error in updating institute', error);
            throw error;
        }
    }
}

module.exports = InstituteDAO;

/*
async function main() {
    const instituteDAO = new InstituteDAO(db);

    try {
        console.log('=== CREATE ===');
        const institute = new Institute({
            acronym: 'IFSP',
            institute_name: 'Instituto Federal de São Paulo'
        });

        const created = await instituteDAO.create(institute);
        console.log('Created:', created);

        console.log('\n=== FIND ALL ===');
        const all = await instituteDAO.getInstitutes();
        console.log(all);

        console.log('\n=== FIND BY ID ===');
        const byId = await instituteDAO.getInstitutebyId(created.id);
        console.log(byId);

        console.log('\n=== FIND BY ACRONYM ===');
        const byAcronym = await instituteDAO.getInstitutebyAcronym('IFSP');
        console.log(byAcronym);

        console.log('\n=== UPDATE ===');
        created.acronym = 'IFSP-UPDATED';
        created.institute_name = 'Instituto Federal SP Atualizado';

        const updated = await instituteDAO.update(created);
        console.log(updated);

        console.log('\n=== EXISTS ===');
        const exists = await instituteDAO.exists(updated.id);
        console.log('Exists?', exists);
        console.log('\n=== DELETE ===');
        const deleted = await instituteDAO.delete(updated.id);
        console.log('Deleted?', deleted);

        console.log('\n=== EXISTS AFTER DELETE ===');
        const existsAfter = await instituteDAO.exists(updated.id);
        console.log('Exists?', existsAfter);

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await db.destroy(); // IMPORTANT: close knex connection
    }
}

main();*/

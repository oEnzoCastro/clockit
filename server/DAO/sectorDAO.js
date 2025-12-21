const AreaDAO = require('./areaDAO');
const Sector = require('../models/sector');
const db = require('../database/db');
const InstituteDAO = require('./instituteDAO');

class SectorDAO {
    constructor(db) {
        this.db = db;
        this.areaDAO = new AreaDAO(this.db);
    }

    async create(sector) {
        const trx = await this.db.transaction();
        try {
            if (!(sector instanceof Sector)) {
                throw new Error("sector must be an instance of Sector");
            }

            const area = await this.areaDAO.getAreaById(sector.area_id);
            if (!area) {
                throw new Error("Area not found for the given area_id");
            }

            const [createdSector] = await trx('sector')
                .insert({
                    sector_name: sector.sector_name,
                    acronym: sector.acronym,
                    area_id: sector.area_id,
                    is_hidden: sector.is_hidden ?? false
                })
                .returning('*');

            if (!createdSector) {
                throw new Error("Failed to create Sector");
            }

            await trx.commit();
            return new Sector(createdSector);

        } catch (error) {
            await trx.rollback();
            console.error('Error occurred in create() SectorDAO:', error);
            throw error;
        }
    }

    async findSectors(filters = {}, trx = this.db) {
        try {
            const {
                id,
                sector_name,
                acronym,
                area_id,
                institute_id,
                agent_id
            } = filters;

            let query = trx('sector as a').select('a.*');
            if (institute_id) {
                query = query
                    .join('area as b', 'a.area_id', 'b.id')
                    .where('b.institute_id', institute_id);
            }
            if (area_id) {
                if (area_id) query.where('a.area_id', area_id);

            }

            if (area_id || institute_id) {
                if (sector_name) query.where('a.sector_name', sector_name);
                if (acronym) query.where('a.acronym', acronym);
            }

            if (agent_id) {
                query = query
                    .join('agent_sector as c', 'a.id', 'c.sector_id')
                    .where('c.agent_id', agent_id);
            }

            if (id) query.where('a.id', id);


            const rows = await query;
            return rows.map(row => new Sector(row));

        } catch (error) {
            console.error("Error in findSectors():", error);
            throw error;
        }
    }


    async getSectorById(id) {
        const res = await this.findSectors({ id });
        return res[0] || null;
    }

    async getSectorsByArea(area_id) {
        return this.findSectors({ area_id });
    }

    async getSectorsByAcronymArea(acronym, area_id) {
        const res = await this.findSectors({ acronym, area_id });
        return res[0] || null;
    }

    async getSectorsByNameArea(sector_name, area_id) {
        const res = await this.findSectors({ sector_name, area_id });
        return res[0] || null;
    }

    async getSectorsByInstitute(institute_id) {
        return this.findSectors({ institute_id });
    }

    async getSectorsByNameInstitute(institute_id, sector_name) {
        return this.findSectors({ institute_id, sector_name });
    }

    async getSectorsByAcronymInstitute(institute_id, acronym) {
        return this.findSectors({ institute_id, acronym });
    }

    async getSectorsByAgentId(agent_id, trx = this.db) {
        return this.findSectors({ agent_id }, trx);
    }


    async update(sector) {
        const trx = await this.db.transaction();
        try {
            if (!(sector instanceof Sector)) {
                throw new Error("sector must be an instance of Sector");
            }

            const { id, sector_name, acronym, is_hidden } = sector.toJSON();

            const existingSectorAcronym = await trx('sector')
                .where({ acronym })
                .whereNot({ id })
                .first();

            const existingSectorName = await trx('sector')
                .where({ sector_name })
                .whereNot({ id })
                .first();

            if (existingSectorAcronym) {
                throw new Error("This acronym is already used by another sector");
            }
            if (existingSectorName) {
                throw new Error("This name is already used by another sector");
            }

            const [updatedSector] = await trx('sector')
                .where({ id })
                .update(
                    is_hidden !== undefined
                        ? { sector_name, acronym, is_hidden }
                        : { sector_name, acronym }
                )
                .returning('*');

            if (!updatedSector) {
                throw new Error("Cannot update sector or sector does not exists");
            }

            await trx.commit();
            return new Sector(updatedSector);

        } catch (error) {
            await trx.rollback();
            console.error("Error occurred in update() SectorDAO:", error);
            throw error;
        }
    }


    async delete(id) {
        const trx = await this.db.transaction();
        try {
            const result = await trx('sector').where({ id }).del();
            if (result > 0) {
                await trx.commit();
                return true;
            }
            await trx.rollback();
            return false;
        } catch (error) {
            await trx.rollback();
            console.error("Error occurred in Delete SectorDAO:", error);
            throw error;
        }
    }


    async exists(id, trx = this.db) {
        const sector = await trx('sector').where({ id }).first();
        return !!sector;
    }

    async existsByNameArea(sector_name, area_id, trx = this.db) {
        const sector = await trx('sector').where({ sector_name, area_id }).first();
        return !!sector;
    }

    async existsByAcronymInstitute(acronym, area_id, trx = this.db) {
        const sector = await trx('sector').where({ acronym, area_id }).first();
        return !!sector;
    }


    async updateHiddenSector(id, is_hidden = true) {
        const trx = await this.db.transaction();
        try {
            const [updated] = await trx('sector')
                .where({ id })
                .update({ is_hidden })
                .returning('*');

            if (!updated) {
                throw new Error("Could not update sector or sector does not exist");
            }

            await trx.commit();
            return updated;

        } catch (error) {
            await trx.rollback();
            console.error("Error in UpdateHiddenSector:", error);
            throw error;
        }
    }
}

module.exports = SectorDAO;
/*
async function main() {
    const sectorDAO = new SectorDAO(db);
    const areaDAO = new AreaDAO(db);
    const instituteDAO = new InstituteDAO(db);

    try {
        console.log('=== GET INSTITUTE ===');
        const institute = (await instituteDAO.getInstitutes())[0];

        if (!institute) {
            throw new Error('No institute found. Create one before testing SectorDAO.');
        }

        console.log('Using institute:', institute);

        console.log('\n=== GET AREA ===');
        const area = (await areaDAO.getAreasByInstitute(institute.id))[0];

        if (!area) {
            throw new Error('No area found. Create an area before testing SectorDAO.');
        }

        console.log('Using area:', area);

        console.log('\n=== CREATE SECTOR ===');
        const sector = new Sector({
            sector_name: 'TESTE',
            acronym: 'TT',
            area_id: area.id,
            is_hidden: false
        });

        const created = await sectorDAO.create(sector);
        console.log('Created:', created);

        console.log('\n=== FIND BY ID ===');
        const byId = await sectorDAO.getSectorById(created.id);
        console.log(byId);

        console.log('\n=== FIND BY AREA ===');
        const byArea = await sectorDAO.getSectorsByArea(area.id);
        console.log(byArea);

        console.log('\n=== FIND BY ACRONYM + AREA ===');
        const byAcronymArea = await sectorDAO.getSectorsByAcronymArea('AI', area.id);
        console.log(byAcronymArea);

        console.log('\n=== FIND BY NAME + AREA ===');
        const byNameArea = await sectorDAO.getSectorsByNameArea('Artificial Intelligence', area.id);
        console.log(byNameArea);

        console.log('\n=== FIND BY INSTITUTE ===');
        const byInstitute = await sectorDAO.getSectorsByInstitute(institute.id);
        console.log(byInstitute);

        console.log('\n=== UPDATE SECTOR ===');
        created.sector_name = 'AI & Machine Learning';
        created.acronym = 'AIML';

        const updated = await sectorDAO.update(created);
        console.log(updated);

        console.log('\n=== HIDE SECTOR ===');
        const hidden = await sectorDAO.updateHiddenSector(updated.id, true);
        console.log(hidden);

        console.log('\n=== EXISTS ===');
        const exists = await sectorDAO.exists(updated.id);
        console.log('Exists?', exists);
        
        console.log('\n=== DELETE SECTOR ===');
        const deleted = await sectorDAO.delete(updated.id);
        console.log('Deleted?', deleted);

        console.log('\n=== FIND AFTER DELETE ===');
        const afterDelete = await sectorDAO.getSectorById(updated.id);
        console.log(afterDelete);

    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await db.destroy(); // IMPORTANT
    }
}

main();
*/


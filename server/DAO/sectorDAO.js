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
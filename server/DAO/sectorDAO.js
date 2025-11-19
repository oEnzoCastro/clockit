const AreaDAO = require('./areaDAO');
const Area = require('../models/area');
const Sector = require('../models/sector');
//const db = require('../database/db');



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

            if (!sector.sector_name) {
                throw new Error("sector must have a name");
            }

            if (!sector.area_id) {
                throw new Error("sector must have an area_id");
            }

            if (!sector.acronym) {
                throw new Error("sector must have an acronym");
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

    async update(sector) {
        const trx = await this.db.transaction();
        try {
            if (!(sector instanceof Sector)) {
                throw new Error("sector must be an instance of Sector");
            }

            const { id, sector_name, acronym, is_hidden } = sector.toJSON();

            if (!id) {
                throw new Error("sector must have an id");
            }


            if (!sector_name) {
                throw new Error("sector must have a name");
            }

            if (!acronym) {
                throw new Error("sector must have an acronym");
            }


            const existingSectorAcronym = await trx('sector').where({ acronym }).whereNot({ id }).first();
            const existingSectorName = await trx('sector').where({ sector_name }).whereNot({ id }).first();

            if (existingSectorAcronym) {
                throw new Error("This acronym is already used by another sector");
            }
            if (existingSectorName) {
                throw new Error("This name is already used by another sector");
            }
            let updatedSector;
            if (is_hidden) {
                [updatedSector] = await trx('sector').where({ id: id }).update({ sector_name, acronym, is_hidden }).returning('*');
            } else {
                [updatedSector] = await trx('sector').where({ id: id }).update({ sector_name, acronym }).returning('*');
            }
            if (!updatedSector) {
                throw new Error("Cannot update sector or sector does not exists");
            }

            await trx.commit();
            return new Sector(updatedSector);


        } catch (error) {
            await trx.rollback();
            console.error("Error occurred in update() SectorDAO:" + error);
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
            } else {
                await trx.rollback();
                return false;
            }
        } catch (error) {
            await trx.rollback();
            console.error("Error occurred in Delete SectorDAO:" + error);
            throw error;
        }
    }

    async getSectorById(id) {
        try {
            const sector = await this.db('sector').where({ id }).first();
            if (!sector) {
                return null;
            }
            return new Sector({ id: sector.id, area_id: sector.area_id, acronym: sector.acronym, sector_name: sector.sector_name, is_hidden: sector.is_hidden || false });
        } catch (error) {
            console.error("Error occurred in getSectorById() SectorDAO:" + error);
            throw error;
        }
    }

    async getSectorsByInstitute(institute_id) {
        try {
            const rows = await this.db('sector as a')
                .join('area as b', 'a.area_id', 'b.id')
                .select('a.*')
                .where('b.institute_id', institute_id);
            if (!rows || rows.length == 0) {
                return [];
            }

            const sectors = rows.map(s => new Sector(s));

            return sectors;

        } catch (error) {
            console.error("Error occurred in getSectorByInstitute() SectorDAO:" + error);
            throw error;
        }
    }

    async getSectorsByArea(area_id) {
        try {
            const rows = await this.db('sector').where({ area_id });
            if (!rows || rows.length == 0) {
                return [];
            }
            const sectors = rows.map(s => new Sector(s));
            return sectors;

        } catch (error) {

        }
    }
    async getSectorsByAcronymArea(acronym, area_id) {
        try {
            const row = await this.db('sector').where({ area_id, acronym }).first();
            if (!row) {
                return null;
            }
            const sectors = new Sector(row);
            return sectors;

        } catch (error) {
            console.error("Error occurred in getSectorsByAcronymArea = SectorDAO:" + error);
            throw error;
        }
    }
    async getSectorsByNameArea(sector_name, area_id) {
        try {
            const row = await this.db('sector').where({ area_id, sector_name }).first();
            if (!row) {
                return null;
            }
            const sectors = new Sector(row);
            return sectors;

        } catch (error) {
            console.error("Error occurred in getSectorsByNameArea SectorDAO:" + error);
            throw error;
        }
    }

    async getSectorsByNameInstitute(institute_id, sector_name) {
        try {
            const rows = await this.db('sector as a')
                .join('area as b', 'a.area_id', 'b.id')
                .select('a.*')
                .where('b.institute_id', institute_id)
                .andWhere('a.sector_name', sector_name);
            if (!rows || rows.length == 0) {
                return [];
            }

            const sectors = rows.map(s => new Sector(s));

            return sectors;

        } catch (error) {
            console.error("Error occurred in getSectorsByNameInstitute SectorDAO:" + error);
            throw error;
        }
    }

    async getSectorsByAcronymInstitute(institute_id, acronym) {
        try {
            const rows = await this.db('sector as a')
                .join('area as b', 'a.area_id', 'b.id')
                .select('a.*')
                .where('b.institute_id', institute_id)
                .andWhere('a.acronym', acronym);
            if (!rows || rows.length == 0) {
                return [];
            }

            const sectors = rows.map(s => new Sector(s));

            return sectors;

        } catch (error) {
            console.error("Error occurred in getSectorsByAcronymInstitute SectorDAO:" + error);
            throw error;
        }
    }

    async getSectorsByAgentId(agent_id,trx=this.db) {
        try {
            const rows = await trx('sector as a')
                .select('a.*')
                .join('agent_sector as b', 'a.id', 'b.sector_id')
                .where('b.agent_id', agent_id);
            if (!rows || rows.length == 0) {
                return [];
            }

            const sectors = rows.map(s => new Sector(s));

            return sectors;

        } catch (error) {
            console.error("Error occurred in getSectorsByAcronymInstitute SectorDAO:" + error);
            throw error;
        }
    }

    async UpdateHiddenSector(id, hidden = true) {
        const trx = await this.db.transaction()
        try {
            const [updated] = await trx('sector')
                .where({ id })
                .update({ is_hidden: hidden })
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
    // 1️⃣ Initialize database connection (edit for your setup)


    const dao = new SectorDAO(db);

    try {
        console.log("=== Testing SectorDAO ===");
        
        // 2️⃣ Create a test Sector
        const sectorData = new Sector({
            sector_name: "SecondTest",
            acronym: "TSTWO",
            area_id: "8a0458ee-c2ea-45fa-8913-fd91f2bc86f5", // use a valid UUID from your DB
            is_hidden: false
        });

        console.log("Creating sector...");
        const created = await dao.create(sectorData);
        console.log("✅ Created sector:", created);

        // 3️⃣ Get by ID
        console.log("\nFetching sector by ID...");
        const fetched = await dao.getSectorById(created.id);
        console.log("✅ Fetched sector:", fetched);

        // 4️⃣ Update the sector
        console.log("\nUpdating sector...");
        fetched.sector_name = "Updated Test Sector 2";
        const updated = await dao.update(fetched);
        console.log("✅ Updated sector:", updated);

        // 5️⃣ Hide the sector
        console.log("\nHiding sector...");
        const hidden = await dao.UpdateHiddenSector(updated.id, true);
        console.log("✅ Sector hidden:", hidden.is_hidden);

        // 6️⃣ List by Area
        console.log("\nGetting sectors by area...");
        const byArea = await dao.getSectorsByArea(created.area_id);
        console.log(`✅ Found ${byArea.length} sector(s) in area.`);
        
        const byInstitute = await dao.getSectorsByAcronymArea('TSTWO',"8a0458ee-c2ea-45fa-8913-fd91f2bc86f5");
        console.log(byInstitute);

        // 7️⃣ Delete the sector

        console.log("\n🎉 All tests completed successfully!");

    } catch (error) {
        console.error("❌ Error during DAO test:", error);
    } finally {
        await db.destroy();
    }
}

main();
*/
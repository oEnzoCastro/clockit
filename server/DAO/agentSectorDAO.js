//const db = require('../database/db');
const AgentSector = require('../models/agentSector');
const SectorDAO = require('./sectorDAO');
const UserDAO = require('./userDAO');


class AgentSectorDAO {
    constructor(db) {
        this.db = db;
        this.userDAO = new UserDAO(db);
        this.sectorDAO = new SectorDAO(db);
    }

    async create(agentSector) {
        const trx = await this.db.transaction();
        try {
            if (!(agentSector instanceof AgentSector)) {
                throw new Error("agentSector must be an instance of AgentSector");
            }
           
            const existingUser = await this.userDAO.getUserById(agentSector.agent_id, trx);

            const existingSector = await this.sectorDAO.getSectorById(agentSector.sector_id, trx);
            if (!existingUser || !existingUser.roles.includes('agent')) {
                throw new Error("User does no Exist");
            }
            if (!existingSector) {
                throw new Error("Sector does not exist");
            }

            const [row] = await trx('agent_sector').insert(agentSector.toJSON()).returning('*');
            if (!row) {
                throw new Error("failed to create agentSector");
            }
            await trx.commit();
            return new AgentSector(row);
        } catch (error) {
            await trx.rollback();
            console.error("Error in create in AgentSectorDAO" + error);
            throw error;
        }
    }

    async update(agentSector) {
        const trx = await this.db.transaction();
        try {

            if (!(agentSector instanceof AgentSector)) {
                throw new Error("agentSector must be an instance of AgentSector");
            }
            const { agent_id, sector_id } = agentSector.toJSON();
            if (!agent_id) {
                throw new Error("agentSector must have an agent_id");
            }
            if (!sector_id) {
                throw new Error("agentSector must have an sector_id");
            }
            if (!agentSector.sector_region) {
                throw new Error("agentSector must have an sector_region");
            }
            const [row] = await trx('agent_sector').update().where({ agent_id, sector_id }).returning('*');

            if (!row) {
                throw new Error("Failed in updating or user does not exist");
            }

            return new AgentSector(agentSector);

        } catch (error) {
            await trx.rollback();
            console.error('Error in update()' + error);
            throw error;
        }
    }

    async delete(agent_id, sector_id) {
        trx = await this.db.transaction();
        try {
            const deleted = await trx('agent_sector').where({ agent_id, sector_id }).del();
            if (deleted) {
                await trx.commit();
                return true;
            } else {
                await trx.rollback();
                return false;
            }
        } catch (error) {
            await trx.rollback();
            console.error('Error in delete()' + error);
            throw error;
        }
    }

    async getBySectorAgent(agent_id, sector_id, trx = this.db) {
        try {
            const row = await trx('agent_sector').where({ agent_id, sector_id }).first();
            return row ? new AgentSector(row) : null;
        } catch (error) {
            console.error("Error in create in getBySectorAgent()" + error);
            throw error;
        }
    }


    async getBySector(sector_id, trx = this.db) {
        try {
            const rows = await trx('agent_sector').where({ sector_id });
            if (!rows || rows.length == 0) {
                return [];
            }

            return rows.map(s => new AgentSector(s));
        } catch (error) {
            console.error("Error in create in getBySector()" + error);
            throw error;
        }
    }

    async getByinstitute(institute_id) {
        try {
            const rows = await this.db('agent_sector as a')
                .select('a.*')
                .join('users as b', 'a.agent_id', 'b.id')
                .where('b.institute_id', institute_id);
            if (!rows || rows.length === 0) {
                return [];
            } else {
                return rows.map(s => new AgentSector(s));
            }
        } catch (error) {
            console.error('Error in getting by Institute in AgentSectorDAO' + error);
            throw error;
        }
    }

    async getBySectorAcronymInstitute(institute_id, acronym) {
        try {
            const rows = await this.db('agent_sector as a')
                .select('a.*')
                .join('users as b', 'a.agent_id', 'b.id')
                .join('sector as c', 'a.sector_id', 'c.id')
                .where('b.institute_id', institute_id)
                .andWhere('c.acronym', acronym);
            if (!rows || rows.length === 0) {
                return [];
            } else {
                return rows.map(s => new AgentSector(s));
            }
        } catch (error) {
            console.error('Error in getting by Acronym and Institute in AgentSectorDAO' + error);
            throw error;
        }
    }
    async getBySectorNameInstitute(institute_id, sector_name) {
        try {
            const rows = await this.db('agent_sector as a')
                .select('a.*')
                .join('users as b', 'a.agent_id', 'b.id')
                .join('sector as c', 'a.sector_id', 'c.id')
                .where('b.institute_id', institute_id)
                .andWhere('c.sector_name', sector_name);
            if (!rows || rows.length === 0) {
                return [];
            } else {
                return rows.map(s => new AgentSector(s));
            }
        } catch (error) {
            console.error('Error in getting by Sector name and Institute in AgentSectorDAO' + error);
            throw error;
        }
    }



    async getByAgent(agent_id, trx = this.db) {
        try {
            const rows = await trx('agent_sector').where({ agent_id });

            if (!rows || rows.length === 0) {
                return [];
            }

            return rows.map(s => new AgentSector(s));

        } catch (error) {
            console.error("Error in getByAgent():", error);
            throw error;
        }
    }



}

/*
async function main() {

    const dao = new AgentSectorDAO(db);


    try {
        console.log("=== Teste: create() ===");
        const agentSector = new AgentSector({
            agent_id: '10263afb-a170-483c-9076-f43d4543eb8b',
            sector_id: '39c08d10-cf2b-4d84-aee4-91b1c36b5f95',
            sector_region: 'Sul'
        });

        const created = await dao.create(agentSector);
        console.log("Criado:", created);

        console.log("\n=== Teste: getBySectorAgent() ===");
        const fetched = await dao.getBySectorAgent(agentSector.agent_id, agentSector.sector_id);
        console.log("Obtido:", fetched);

        console.log("\n=== Teste: getByAgent() ===");
        const byAgent = await dao.getByAgent(agentSector.agent_id);
        console.log("Todos os setores do agente:", byAgent);

        console.log("\n=== Teste: getBySector() ===");
        const bySector = await dao.getBySector(agentSector.sector_id);
        console.log("Todos os agentes do setor:", bySector);

        console.log("\n=== Teste: update() ===");
        agentSector.sector_region = 'Norte';
        const updated = await dao.update(agentSector);
        console.log("Atualizado:", updated);

        console.log("\n=== Teste: getBySectorAcronymInstitute() ===");
        const byAcronym = await dao.getBySectorAcronymInstitute('uuid-institute-valido', 'ADM');
        console.log("Agentes do setor com acrônimo ADM:", byAcronym);

        console.log("\n=== Teste: getBySectorNameInstitute() ===");
        const byName = await dao.getBySectorNameInstitute('uuid-institute-valido', 'Setor Administrativo');
        console.log("Agentes do setor 'Setor Administrativo':", byName);

        console.log("\n=== Teste: delete() ===");
        const deleted = await dao.delete(agentSector.agent_id, agentSector.sector_id);
        console.log("Deletado com sucesso?", deleted);

    } catch (error) {
        console.error("Erro durante o teste do AgentSectorDAO:", error);
    } finally {
        await db.destroy();
        console.log("\nConexão encerrada.");
    }
}

main();*/
module.exports = AgentSectorDAO;
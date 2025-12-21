const AgentSector = require('../models/agentSector');
const DaySchedule = require('../models/daySchedule');
const UserDAO = require('./userDAO');
const SectorDAO = require('./sectorDAO');
const DayScheduleDAO = require('./dayScheduleDAO');



class AgentSectorDAO {
    constructor(db) {
        this.db = db;
        this.userDAO = new UserDAO(db);
        this.sectorDAO = new SectorDAO(db);
        this.dayScheduleDAO = new DayScheduleDAO(db);
    }


    async create(agentSector) {
        const trx = await this.db.transaction();
        try {
            if (!(agentSector instanceof AgentSector)) {
                throw new Error("agentSector must be an instance of AgentSector");
            }

            const {
                agent_id,
                sector_id,
                agent_workload,
                sector_region,
                sector_location,
                description,
                is_hidden,
                contract_start,
                contract_end,
                daySchedules
            } = agentSector.toJSON();

            const agent = await this.userDAO.getUserById(agent_id, trx);
            if (!agent || agent.institute_role !== 'agent') {
                throw new Error("User does not exist or is not an agent");
            }

            const sector = await this.sectorDAO.getSectorById(sector_id);
            if (!sector) {
                throw new Error("Sector does not exist");
            }

            const exists = await trx('agent_sector')
                .where({ agent_id, sector_id })
                .first();

            if (exists) {
                throw new Error("Agent already assigned to this sector");
            } c

            await trx('agent_sector').insert({
                agent_id,
                sector_id,
                agent_workload,
                sector_region,
                sector_location,
                description: description,
                is_hidden: is_hidden ?? false,
                contract_start,
                contract_end
            });

            if (Array.isArray(daySchedules) && daySchedules.length > 0) {
                for (const ds of daySchedules) {
                    await this.dayScheduleDAO.create(
                        new DaySchedule({
                            agent_id,
                            sector_id,
                            schedule_day: ds.schedule_day,      // ✅ FIX HERE
                            schedule: ds.schedule
                        }),
                        trx
                    );
                }
            }


            await trx.commit();
            return this.getByAgentSector(agent_id, sector_id);

        } catch (error) {
            await trx.rollback();
            console.error("Error in AgentSectorDAO.create:", error);
            throw error;
        }
    }


    async findByAgent(filters = {}, trx = this.db) {
        const {
            agent_id,
            sector_id,
            institute_id,
            area_id,
            sector_name,
            sector_acronym,
            is_hidden,
            currentContract,
            area_name,
            area_acronym,
            user_first_name,
            user_surname
        } = filters;

        const query = trx('users as u')
            .select(
                'u.id as agent_id',
                'u.first_name as agent_first_name',
                'u.surname as agent_surname',
                'u.email as agent_email',
                'u.institute_id as agent_institute_id',

                'asg.*',

                's.id as sector_id',
                's.acronym as sector_acronym',
                's.sector_name as sector_name',

                'ds.schedule_day',
                'ds.schedule'
            )
            .leftJoin('agent_sector as asg', 'u.id', 'asg.agent_id')
            .leftJoin('sector as s', 'asg.sector_id', 's.id')
            .leftJoin('day_schedule as ds', function () {
                this.on('asg.agent_id', 'ds.agent_id')
                    .andOn('asg.sector_id', 'ds.sector_id');
            })
            .leftJoin('area as a', 's.area_id', 'a.id');


        if (institute_id) {
            query.where('u.institute_id', institute_id);
        }


        if (agent_id) query.where('u.id', agent_id);
        if (sector_id) query.where('asg.sector_id', sector_id);
        if (area_id) query.where('a.id', area_id);



        if (institute_id || area_id) {
            if (sector_name) query.where('s.sector_name', sector_name);
            if (sector_acronym) query.where('s.acronym', sector_acronym);
            if (typeof is_hidden === 'boolean') query.where('asg.is_hidden', is_hidden);
            if (user_first_name) {
                query.where('u.first_name', user_first_name);
                if (user_surname) query.where('u.surname', user_surname);
            }
        }


        if (institute_id) {
            if (area_name) query.where('a.area_name', area_name);
            if (area_acronym) query.where('a.acronym', area_acronym);
        }


        if (currentContract === true) {
            query.where('asg.contract_end', '>', new Date());
        }

        query.where('u.institute_role', 'agent');

        const rows = await query;
        return this._group(rows);
    }


    async update(agentSector) {
        const trx = await this.db.transaction();
        try {
            if (!(agentSector instanceof AgentSector)) {
                throw new Error("agentSector must be an instance of AgentSector");
            }

            const {
                agent_id,
                sector_id,
                agent_workload,
                sector_region,
                sector_location,
                description,
                is_hidden,
                contract_start,
                contract_end,
                daySchedules
            } = agentSector.toJSON();

            const exists = await trx('agent_sector')
                .where({ agent_id, sector_id })
                .first();

            if (!exists) {
                throw new Error("Contract does not exist for this agent and sector");
            }

            const agent = await this.userDAO.getUserById(agent_id, trx);
            if (!agent || agent.institute_role !== 'agent') {
                throw new Error("User does not exist or is not an agent");
            }

            const sector = await this.sectorDAO.getSectorById(sector_id);
            if (!sector) {
                throw new Error("Sector does not exist");
            }

            const updateData = {};
            if (typeof agent_workload !== 'undefined') updateData.agent_workload = agent_workload;
            if (typeof sector_region !== 'undefined') updateData.sector_region = sector_region;
            if (typeof sector_location !== 'undefined') updateData.sector_location = sector_location;
            if (typeof description !== 'undefined') updateData.description = description;
            if (typeof is_hidden !== 'undefined') updateData.is_hidden = is_hidden;
            if (typeof contract_start !== 'undefined') updateData.contract_start = contract_start;
            if (typeof contract_end !== 'undefined') updateData.contract_end = contract_end;

            if (Object.keys(updateData).length > 0) {
                await trx('agent_sector')
                    .where({ agent_id, sector_id })
                    .update(updateData);
            }

            await trx('day_schedule')
                .where({ agent_id, sector_id })
                .del();

            if (Array.isArray(daySchedules) && daySchedules.length > 0) {
                for (const ds of daySchedules) {
                    await this.dayScheduleDAO.create(
                        new DaySchedule({
                            agent_id,
                            sector_id,
                            schedule_day: ds.schedule_day,
                            schedule: ds.schedule
                        }),
                        trx
                    );
                }
            }

            await trx.commit();
            return this.getByAgentSector(agent_id, sector_id);
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }




    async cancelContract(agent_id, sector_id) {
        if (!agent_id) {
            throw new Error("agent_id is required");
        }

        const trx = await this.db.transaction();
        try {
            const agent = await this.userDAO.getUserById(agent_id, trx);
            if (!agent || agent.institute_role !== 'agent') {
                throw new Error("User does not exist or is not an agent");
            }

            if (sector_id) {
                const sector = await this.sectorDAO.getSectorById(sector_id);
                if (!sector) throw new Error("Sector does not exist");

                const exists = await trx('agent_sector')
                    .where({ agent_id, sector_id })
                    .first();

                if (!exists) {
                    throw new Error("Agent is not assigned to this sector");
                }
            }

            const affectedRows = await trx('agent_sector')
                .where({ agent_id })
                .modify(qb => {
                    if (sector_id) qb.andWhere({ sector_id });
                })
                .update({
                    contract_end: new Date()
                });

            if (affectedRows === 0) {
                await trx.rollback();
                return false;
            }

            await trx.commit();
            return true;

        } catch (error) {
            await trx.rollback();
            console.error("Error in AgentSectorDAO.cancelContract:", error);
            throw error;
        }
    }






    async getByAgentSector(agent_id, sector_id) {
        const results = await this.findByAgent({ agent_id, sector_id });
        return results.length ? results[0] : null;
    }

    async getByAgent(agent_id) {
        return this.findByAgent({ agent_id });
    }

    async getBySector(sector_id) {
        return this.findByAgent({ sector_id });
    }

    async getByInstitute(institute_id) {
        return this.findByAgent({ institute_id });
    }
    async getByInstitute(institute_id) {
        return this.findByAgent({ institute_id });
    }

    async delete(agent_id, sector_id) {
        let trx;
        try {
            trx = await this.db.transaction();


            const result = await trx('agent_sector').where({ agent_id, sector_id }).del();

            if (result > 0) {
                await trx.commit();
                return true;
            } else {
                await trx.rollback();
                return false;
            }
        } catch (error) {
            if (trx) await trx.rollback();
            console.error('Error in delete user:', error);
            throw error;
        }
    }

    async findSectors(filters = {}, trx = this.db) {
        const {
            agent_id,
            sector_id,
            institute_id,
            area_id,
            sector_name,
            sector_acronym,
            is_hidden,
            user_first_name,
            user_surname,
            area_name,
            area_acronym,
            currentContract
        } = filters;

        const query = trx('users as u')
            .select(
                'u.id as agent_id',
                'u.first_name as agent_first_name',
                'u.surname as agent_surname',
                'u.email as agent_email',
                'u.institute_id as agent_institute_id',

                'asg.agent_workload',
                'asg.sector_region',
                'asg.sector_location',
                'asg.description',
                'asg.is_hidden',
                'asg.contract_end',

                's.id as sector_id',
                's.acronym as sector_acronym',
                's.sector_name',

                'ds.schedule_day',
                'ds.schedule'
            )
            .leftJoin('agent_sector as asg', 'u.id', 'asg.agent_id')
            .leftJoin('sector as s', 'asg.sector_id', 's.id')
            .leftJoin('day_schedule as ds', function () {
                this.on('asg.agent_id', 'ds.agent_id')
                    .andOn('asg.sector_id', 'ds.sector_id');
            })
            .leftJoin('area as a', 's.area_id', 'a.id');

        if (institute_id) query.where('u.institute_id', institute_id);
        if (agent_id) query.where('u.id', agent_id);
        if (sector_id) query.where('asg.sector_id', sector_id);
        if (area_id) query.where('a.id', area_id);

        if (institute_id || area_id) {
            if (sector_name) query.where('s.sector_name', sector_name);
            if (sector_acronym) query.where('s.acronym', sector_acronym);
            if (typeof is_hidden === 'boolean') query.where('asg.is_hidden', is_hidden);
        }

        if (institute_id) {
            if (area_name) query.where('a.area_name', area_name);
            if (area_acronym) query.where('a.acronym', area_acronym);

            if (user_first_name) {
                query.where('u.first_name', user_first_name);
                if (user_surname) query.where('u.surname', user_surname);
            }
        }

        if (currentContract === true) {
            query.where('asg.contract_end', '>', new Date());
        }

        query.where('u.institute_role', 'agent');

        const rows = await query;

        return this.groupBySector(rows);
    }




    _group(rows) {
        const map = new Map();

        for (const row of rows) {

            const agentKey = row.agent_id;

            if (!map.has(agentKey)) {
                map.set(agentKey, {
                    id: row.agent_id,
                    first_name: row.agent_first_name,
                    surname: row.agent_surname,
                    email: row.agent_email,
                    institute_id: row.agent_institute_id,
                    sectors: [],
                    daySchedules: []
                });
            }

            const agent = map.get(agentKey);

            if (row.sector_id && !agent.sectors.some(s => s.id === row.sector_id)) {
                agent.sectors.push({
                    id: row.sector_id,
                    acronym: row.sector_acronym,
                    sector_name: row.sector_name,
                    agent_workload: row.agent_workload || 0,
                    sector_region: row.sector_region || null,
                    sector_location: row.sector_location || null,
                    description: row.description || null,
                    is_hidden: row.is_hidden || false,
                    contract_start: row.contract_start || null,
                    contract_end: row.contract_end || null
                });
            }

            if (row.sector_id && row.schedule_day && row.schedule) {
                if (!agent.daySchedules.some(ds => ds.sector_id === row.sector_id && ds.schedule_day === row.schedule_day)) {
                    agent.daySchedules.push({
                        agent_id: row.agent_id,
                        sector_id: row.sector_id,
                        schedule_day: row.schedule_day,
                        schedule: row.schedule
                    });
                }
            }
        }

        return Array.from(map.values());
    }

    groupBySector(rows) {
        const sectorMap = new Map();

        for (const row of rows) {

            if (row.sector_id) {
                if (!sectorMap.has(row.sector_id)) {
                    sectorMap.set(row.sector_id, {
                        id: row.sector_id,
                        acronym: row.sector_acronym,
                        sector_name: row.sector_name,
                        sector_region: row.sector_region || null,
                        sector_location: row.sector_location || null,
                        description: row.description || null,
                        is_hidden: row.is_hidden || false,
                        agents: []
                    });
                }

                const sectorGroup = sectorMap.get(row.sector_id);


                let agent = sectorGroup.agents.find(a => a.id === row.agent_id);
                if (!agent) {
                    agent = {
                        id: row.agent_id,
                        first_name: row.agent_first_name,
                        surname: row.agent_surname,
                        email: row.agent_email,
                        institute_id: row.agent_institute_id,
                        schedules: []
                    };
                    sectorGroup.agents.push(agent);
                }


                if (row.schedule_day && row.schedule) {
                    const alreadyHas = agent.schedules.some(
                        s => s.schedule_day === row.schedule_day && s.schedule === row.schedule
                    );
                    if (!alreadyHas) {
                        agent.schedules.push({
                            schedule_day: row.schedule_day,
                            schedule: row.schedule
                        });
                    }
                }
            }
        }

        return Array.from(sectorMap.values());
    }



}

module.exports = AgentSectorDAO;

/*
async function main() {
    const dao = new AgentSectorDAO(db);

    try {
        // === 1. Create a new agent-sector assignment ===
        const agentSector = new AgentSector({
            agent_id: "48de46a5-aa30-4b22-b1e2-345654660b26",              // Change to a valid agent ID
            sector_id: "d8e7a1c5-aafb-4ec6-a28d-552245f7a9e8",             // Change to a valid sector ID
            agent_workload: 40,
            sector_region: 'North',
            sector_location: 'Building A',
            description: 'Test assignment',
            is_hidden: false,
            contract_start: new Date(),
            contract_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            daySchedules: [
                new DaySchedule({
                    agent_id: "48de46a5-aa30-4b22-b1e2-345654660b26",              // Change to a valid agent ID
                    sector_id: "9f0381c9-c2ac-48a2-b88b-95dc074d2e7c", schedule_day: 'SEG', schedule: '09:00-17:00'
                }),
                new DaySchedule({
                    agent_id: "48de46a5-aa30-4b22-b1e2-345654660b26",              // Change to a valid agent ID
                    sector_id: "9f0381c9-c2ac-48a2-b88b-95dc074d2e7c", schedule_day: 'TER', schedule: '10:00-18:00'
                })
            ]
        });

        console.log('Creating agent-sector assignment...');
        const created = await dao.create(agentSector);
        console.log('Created:', created);

        // === 2. Fetch by agent ===
        console.log('\nFetching by agent_id...');
        const byAgent = await dao.getByAgent("48de46a5-aa30-4b22-b1e2-345654660b26");
        console.log(JSON.stringify(byAgent, null, 2));


        // === 3. Fetch by agent-sector ===
        console.log('\nFetching by agent-sector...');
        const byAgentSector = await dao.getByAgentSector("48de46a5-aa30-4b22-b1e2-345654660b26", "d8e7a1c5-aafb-4ec6-a28d-552245f7a9e8");
        console.log(byAgentSector);

        // === 4. Optionally cancel contract ===
        console.log('\nCancelling contract...');
        const cancelled = await dao.cancelContract("48de46a5-aa30-4b22-b1e2-345654660b26", "d8e7a1c5-aafb-4ec6-a28d-552245f7a9e8");
        console.log('Contract cancelled:', cancelled);

        // === 5. Fetch again after cancellation ===
        console.log('\nFetching after contract cancellation...');
        const afterCancel = await dao.getByAgentSector("48de46a5-aa30-4b22-b1e2-345654660b26", "d8e7a1c5-aafb-4ec6-a28d-552245f7a9e8");
        console.log(afterCancel);

    } catch (error) {
        console.error('Error in main:', error);
    } finally {
        await db.destroy(); // Close DB connection
    }
}

// Run main
main();*/
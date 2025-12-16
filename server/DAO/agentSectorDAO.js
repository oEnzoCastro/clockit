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

    /* =====================================================
     * CREATE
     * ===================================================== */
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
            }

            await trx('agent_sector').insert({
                agent_id,
                sector_id,
                agent_workload,
                sector_region,
                sector_location,
                sector_description: description,
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
                            schedule_day: ds.day,      // ✅ FIX HERE
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

    /* =====================================================
     * GENERIC FIND (NO PAGINATION)
     * ===================================================== */
    async find(filters = {}, trx = this.db) {
        const {
            agent_id,
            sector_id,
            institute_id,
            area_id,
            sector_name,
            sector_acronym,
            is_hidden,
            currentContract
        } = filters;

        const query = trx('agent_sector as asg')
            .select(
                'asg.*',

                'u.id as agent_id',
                'u.first_name as agent_first_name',
                'u.surname as agent_surname',
                'u.email as agent_email',
                'u.institute_id as agent_institute_id',

                's.id as sector_id',
                's.acronym as sector_acronym',
                's.sector_name as sector_name',

                'ds.schedule_day',
                'ds.schedule'
            )
            .join('users as u', 'asg.agent_id', 'u.id')
            .join('sector as s', 'asg.sector_id', 's.id')
            .leftJoin(
                'day_schedule as ds',
                function () {
                    this.on('asg.agent_id', 'ds.agent_id')
                        .andOn('asg.sector_id', 'ds.sector_id');
                }
            );

        if (area_id || institute_id) {
            query.join('area as a', 's.area_id', 'a.id');
        }

        if (agent_id) query.where('asg.agent_id', agent_id);
        if (sector_id) query.where('asg.sector_id', sector_id);
        if (sector_name) query.where('s.sector_name', sector_name);
        if (sector_acronym) query.where('s.acronym', sector_acronym);
        if (area_id) query.where('a.id', area_id);
        if (institute_id) query.where('u.institute_id', institute_id);
        if (typeof is_hidden === 'boolean') query.where('asg.is_hidden', is_hidden);
        if (currentContract === true) query.where('asg.contract_end', '>=', new Date());


        const rows = await query;
        return this._group(rows);
    }

    /* =====================================================
     * FIND HELPERS
     * ===================================================== */
    async getByAgentSector(agent_id, sector_id) {
        const results = await this.find({ agent_id, sector_id });
        return results.length ? results[0] : null;
    }

    async getByAgent(agent_id) {
        return this.find({ agent_id });
    }

    async getBySector(sector_id) {
        return this.find({ sector_id });
    }

    async getByInstitute(institute_id) {
        return this.find({ institute_id });
    }

    /* =====================================================
     * GROUP ROWS (LEFT JOIN SAFE)
     * ===================================================== */
    _group(rows) {
        const map = new Map();

        for (const row of rows) {
            const key = `${row.agent_id}:${row.sector_id}`;

            if (!map.has(key)) {
                map.set(key, new AgentSector({
                    agent_id: row.agent_id,
                    sector_id: row.sector_id,
                    agent_workload: row.agent_workload,
                    sector_region: row.sector_region,
                    sector_location: row.sector_location,
                    description: row.sector_description,
                    is_hidden: row.is_hidden,
                    contract_start: row.contract_start,
                    contract_end: row.contract_end,

                    agent: {
                        id: row.agent_id,
                        first_name: row.agent_first_name,
                        surname: row.agent_surname,
                        email: row.agent_email,
                        institute_id: row.agent_institute_id
                    },

                    sector: {
                        id: row.sector_id,
                        acronym: row.sector_acronym,
                        sector_name: row.sector_name
                    },

                    daySchedules: []
                }));
            }

            if (row.schedule_day && row.schedule) {
                const schedules = map.get(key).daySchedules;
                if (!schedules.some(ds => ds.schedule_day === row.schedule_day)) {
                    schedules.push(
                        new DaySchedule({
                            agent_id: row.agent_id,
                            sector_id: row.sector_id,
                            schedule_day: row.schedule_day,
                            schedule: row.schedule
                        })
                    );
                }
            }
        }

        return Array.from(map.values());
    }
}

module.exports = AgentSectorDAO;

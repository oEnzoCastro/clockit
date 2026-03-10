const DaySchedule = require('../models/daySchedule');
const db = require('../database/db');


class DayScheduleDAO {
    constructor(db) {
        this.db = db;

    }

    async create(daySchedule, trx = this.db) {
        let localTrx = null;

        try {
            if (!(daySchedule instanceof DaySchedule)) {
                throw new Error("schedule must be an instance of DaySchedule");
            }

            const { agent_id, sector_id } = daySchedule.toJSON();

            // Create local transaction ONLY if none was provided
            if (trx === this.db) {
                localTrx = await this.db.transaction();
                trx = localTrx;
            }

            const agentSector = await trx('agent_sector')
                .where({ agent_id, sector_id })
                .first();

            if (!agentSector) {
                throw new Error("agent does not work in this sector");
            }

            const existing = await this.getDaySchedule(daySchedule, trx);
            if (existing) {
                throw new Error("day_schedule already exists");
            }

            const [row] = await trx('day_schedule')
                .insert(daySchedule.toJSON())
                .returning('*');

            if (localTrx) await localTrx.commit(); // ✅ only if local
            return new DaySchedule(row);

        } catch (error) {
            if (localTrx) await localTrx.rollback(); // ✅ only if local
            console.error("Error in create daySchedule:", error);
            throw error;
        }
    }


    async delete(agent_id, sector_id, schedule_day) {
        const trx = await this.db.transaction();
        try {
            const rows = await trx('day_schedule')
                .where({ agent_id, sector_id, schedule_day })
                .del();

            await trx.commit();
            return rows > 0;
        } catch (error) {
            await trx.rollback();
            console.error("Error in delete daySchedule:", error);
            throw error;
        }
    }

    async update(daySchedule) {
        const trx = await this.db.transaction();
        try {
            if (!(daySchedule instanceof DaySchedule)) {
                throw new Error("schedule must be an instance of DaySchedule");
            }

            const existing = await this.getDaySchedule(daySchedule, trx);
            if (!existing) {
                throw new Error("day_schedule does not exist");
            }

            const [row] = await trx('day_schedule')
                .where({
                    agent_id: daySchedule.agent_id,
                    sector_id: daySchedule.sector_id,
                    schedule_day: daySchedule.schedule_day
                })
                .update(daySchedule.toJSON())
                .returning('*');

            await trx.commit();
            return new DaySchedule(row);

        } catch (error) {
            await trx.rollback();
            console.error("Error in update daySchedule:", error);
            throw error;
        }
    }


    async getDaySchedule(daySchedule, trx = this.db) {
        const { agent_id, sector_id, schedule_day } = daySchedule.toJSON();

        const row = await trx('day_schedule')
            .where({ agent_id, sector_id, schedule_day })
            .first();

        return row ? new DaySchedule(row) : null;
    }

    
    async find(filters = {}, trx = this.db) {
        const {
            agent_id,
            sector_id,
            schedule_day,
            area_id,
            institute_id,
            sector_name,
            sector_acronym
        } = filters;

        const query = trx('day_schedule as ds')
            .select('ds.*')
            .join('sector as s', 'ds.sector_id', 's.id')
            .join('area as a', 's.area_id', 'a.id');

    
        if (institute_id) {
            query.join('institute as i', 'a.institute_id', 'i.id')
                .where('i.id', institute_id);
        }

        if (agent_id) {
            query.where('ds.agent_id', agent_id);
        }

        if (sector_id) {
            query.where('ds.sector_id', sector_id);
        }



        if (area_id) {
            query.where('a.id', area_id);
        }

        if (institute_id || area_id) {
            if (sector_name) {
                query.where('s.sector_name', sector_name);

            }
            if (schedule_day) {
                query.where('ds.schedule_day', schedule_day);
            }

            if (sector_acronym) {
                query.where('s.acronym', sector_acronym);
            }
        }

        const rows = await query;
        return rows.map(row => new DaySchedule(row));
    }


}

module.exports = DayScheduleDAO;
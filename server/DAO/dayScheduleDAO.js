const DaySchedule = require('../models/daySchedule');
const db = require('../database/db');


class DayScheduleDAO {
    constructor(db) {
        this.db = db;

    }

    // =========================
    // CREATE
    // =========================
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


    // =========================
    // DELETE
    // =========================
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

    // =========================
    // UPDATE
    // =========================
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

    // =========================
    // GET ONE (COMPOSITE KEY)
    // =========================
    async getDaySchedule(daySchedule, trx = this.db) {
        const { agent_id, sector_id, schedule_day } = daySchedule.toJSON();

        const row = await trx('day_schedule')
            .where({ agent_id, sector_id, schedule_day })
            .first();

        return row ? new DaySchedule(row) : null;
    }

    // =========================
    // FIND (FILTERS)
    // =========================
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
            .select('ds.*');

        if (area_id || institute_id || sector_name || sector_acronym) {
            query.join('sector as s', 'ds.sector_id', 's.id');
        }

        if (area_id || institute_id) {
            query.join('area as a', 's.area_id', 'a.id');
        }

        if (institute_id) {
            query.join('institute as i', 'a.institute_id', 'i.id');
        }

        if (agent_id) query.where('ds.agent_id', agent_id);
        if (sector_id) query.where('ds.sector_id', sector_id);
        if (schedule_day) query.where('ds.schedule_day', schedule_day);
        if (area_id) query.where('a.id', area_id);
        if (institute_id) query.where('i.id', institute_id);
        if (sector_name) query.where('s.sector_name', sector_name);
        if (sector_acronym) query.where('s.acronym', sector_acronym);

        const rows = await query;
        return rows.map(r => new DaySchedule(r));
    }

}

module.exports = DayScheduleDAO;

/*
async function main() {
    const dayScheduleDAO = new DayScheduleDAO(db);

    // ⚠️ CHANGE THESE IDS TO VALID ONES IN YOUR DB
    const agent_id = "cdace5d7-9ebb-4433-a01a-328912aae5fe";
    const sector_id = "9d98182d-1939-4a40-a619-d0ad0ee7f7f3";

    try {
        console.log('==============================');
        console.log('CREATE DAY SCHEDULE');
        console.log('==============================');

        const schedule = new DaySchedule({
            agent_id,
            sector_id,
            schedule_day: 'QUI',
            schedule: '08:00-12:00'
        });

        const created = await dayScheduleDAO.create(schedule);
        console.log('Created:', created);

        console.log('\n==============================');
        console.log('GET DAY SCHEDULE');
        console.log('==============================');

        const fetched = await dayScheduleDAO.getDaySchedule(schedule);
        console.log('Fetched:', fetched);

        console.log('\n==============================');
        console.log('UPDATE DAY SCHEDULE');
        console.log('==============================');

        fetched.schedule = '09:00-13:00';
        const updated = await dayScheduleDAO.update(fetched);
        console.log('Updated:', updated);

        console.log('\n==============================');
        console.log('FIND BY AGENT');
        console.log('==============================');

        const byAgent = await dayScheduleDAO.find({ agent_id });
        console.log(byAgent);

        console.log('\n==============================');
        console.log('FIND BY SECTOR');
        console.log('==============================');

        const bySector = await dayScheduleDAO.find({ sector_id });
        console.log(bySector);

        console.log('\n==============================');
        console.log('DELETE DAY SCHEDULE');
        console.log('==============================');

        const deleted = await dayScheduleDAO.deleteSchedule(
            agent_id,
            sector_id,
            'QUI'
        );
        console.log('Deleted?', deleted);

        console.log('\n==============================');
        console.log('FIND AFTER DELETE');
        console.log('==============================');

        const afterDelete = await dayScheduleDAO.find({
            agent_id,
            sector_id
        });
        console.log(afterDelete);

    } catch (error) {
        console.error('TEST FAILED:', error.message);
    } finally {
        await db.destroy(); // IMPORTANT
        console.log('\nDB connection closed.');
    }
}

main();
*/
const BaseModel = require('./baseModel');

class DaySchedule extends BaseModel {
    constructor(fields = {}) {
        super(
            fields,
            // 🔑 Composite primary key
            ['agent_id', 'sector_id', 'schedule_day'],
            {
                schedule: { min: 1, max: 255 }
            }
        );

        this.agent_id = fields.agent_id;
        this.sector_id = fields.sector_id;
        if (!this.isWeekDay(fields.schedule_day)) {
            throw new Error("Value is not a weekday");
        }
        this.schedule_day = fields.schedule_day; // enum: week_day
        this.schedule = fields.schedule;

        this.created_at = fields.created_at;
        this.updated_at = fields.updated_at;
    }

    toJSON() {
        const json = {
            agent_id: this.agent_id,
            sector_id: this.sector_id,
            schedule_day: this.schedule_day,
            schedule: this.schedule,
            created_at: this.created_at,
            updated_at: this.updated_at,
            ...super.toJSON()
        };

        // 🧹 Remove null / undefined
        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );

        return json;
    }

    isWeekDay(schedule_day) {
        const WEEK_DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'];
        return WEEK_DAYS.includes(schedule_day);
    }

}


module.exports = DaySchedule;

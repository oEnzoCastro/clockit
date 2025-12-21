const BaseModel = require('./baseModel');


class AgentSector extends BaseModel {
    constructor(fields = {}) {
        super(fields,
            ["agent_id", 'sector_id', "sector_region","contract_start","contract_end"],
            {
                area_acronym: { min: 1, max: 10 },
                sector_acronym: { min: 1, max: 10 },
                schedule: { max: 255 }
            }
        );
        
        this.agent_id = fields.agent_id;
        this.agent = fields.agent;
        this.sector = fields.sector
        this.sector_id = fields.sector_id;
        this.agent_workload = fields.agent_workload || 0;
        this.contract_start = fields.contract_start;
        this.contract_end = fields.contract_end;
        this.daySchedules = fields.daySchedules || [];
        this.sector_location = fields.sector_location;
        this.sector_region = fields.sector_region;
        this.description = fields.description;
        this.is_hidden = fields.is_hidden;

    }



    toJSON() {
        const json = {
            agent_id: this.agent_id,
            agent_first_name: this.agent?.first_name,
            agent_surname: this.agent?.surname,
            agent_code: this.agent?.code,
            agent_email: this.agent?.email,

            sector_id: this.sector_id,
            sector_acronym: this.sector?.acronym,
            sector_name: this.sector?.sector_name,   // <-- CORREÇÃO

            agent_workload: this.agent_workload,
            daySchedules: this.formatSchedules(),
            sector_location: this.sector_locaction,
            sector_region: this.sector_region,
            description: this.description,
            is_hidden: this.is_hidden,
            contract_start:this.contract_start,
            contract_end:this.contract_end,
            ...super.toJSON()
        };

        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );

        return json;
    }

    

    formatSchedules() {
        const schedules = [];
        this.daySchedules.map(daySchedule => {
            schedules.push({schedule_day:daySchedule.schedule_day,schedule:daySchedule.schedule})
        })
        return schedules;
    }

}

module.exports = AgentSector;
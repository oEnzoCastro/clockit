import { BaseModel } from './baseModel.js';


class AgentSector extends BaseModel {
    constructor(fields = {}) {
        super(fields,
            ["agent_id", "institute_id", "area_acronym", "sector_acronym", "region"],
            {
                area_acronym: { min: 1, max: 10 },
                sector_acronym: { min: 1, max: 10 },
                schedule: { max: 255 }
            }
        );
        this.agent_id = fields.agent_id;
        this.institute_id = fields.institute_id;
        this.area_acronym = fields.area_acronym;
        this.sector_acronym = fields.sector_acronym;
        this.agent_workload = fields.agent_workload || 0;
        this.schedule = fields.schedule || null;
        this.location = fields.location;
        this.region = fields.region;
        this.description = fields.description;
        Object.defineProperty(this, 'agent_id', { writable: false });
        Object.defineProperty(this, 'institute_id', { writable: false });
        Object.defineProperty(this, 'area_acronym', { writable: false });
        Object.defineProperty(this, 'sector_acronym', { writable: false });

    }


    toJSON() {
        const json = {
            agent_id: this.agent_id,
            institute_id: this.institute_id,
            area_acronym: this.area_acronym,
            sector_acronym: this.sector_acronym,
            agent_workload: this.agent_workload,
            schedule: this.schedule,
            location: this.location,
            region: this.region,
            description: this.description,
            ...super.toJSON()
        };
        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );
        return json;
    }
}

module.exports = AgentSector;
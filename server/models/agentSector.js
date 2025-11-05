const BaseModel = require('./baseModel');


class AgentSector extends BaseModel {
    constructor(fields = {}) {
        super(fields,
            ["agent_id",'sector_id', "region"],
            {
                area_acronym: { min: 1, max: 10 },
                sector_acronym: { min: 1, max: 10 },
                schedule: { max: 255 }
            }
        );
        this.agent_id = fields.agent_id;
        this.sector_id = fields.sector_id;
        this.agent_workload = fields.agent_workload || 0;
        this.schedule = fields.schedule || null;
        this.location = fields.location;
        this.region = fields.region;
        this.description = fields.description;
        this.is_hidden = fields.is_hidden ;
        Object.defineProperty(this, 'agent_id', { writable: false });
        Object.defineProperty(this, 'sector_id', { writable: false });

    }


    toJSON() {
        const json = {
            agent_id: this.agent_id,
            sector_id: this.sector_id,
            agent_workload: this.agent_workload,
            schedule: this.schedule,
            location: this.location,
            region: this.region,
            description: this.description,
            is_hidden: this.is_hidden,
            ...super.toJSON()
        };
        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );
        return json;
    }
}

module.exports = AgentSector;
import { User } from './user.js';


class Agent extends User{
    constructor(fields = {}) {
        const roles = fields.roles || [];
        if(!roles.includes("agent")) roles.push("agent");
        super({...fields,roles});

        if(!fields.sectors || !Array.isArray(fields.sectors) || fields.sectors.length === 0){
            throw new Error("Agent must be assigned to at least one sector");
        }

        this.sectors = (fields.sectors || []).map(s => new AgentSector({ ...s, agent_id: this.id }));
        Object.defineProperty(this, "sectors", { writable: false });

    }


      toJSON() {
        const json = {
            ...super.toJSON(),               // include all User fields      
            sectors: this.sectors.map(s => s.toJSON()) // include sectors as JSON
        };

        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );
        return json;
    }
}

module.exports = Agent;
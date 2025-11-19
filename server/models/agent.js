const  User  = require('./user');



class Agent extends User {
    constructor(fields = {}) {
        const roles = Array.isArray(fields.roles) ? [...fields.roles] : [];
        if (!roles.includes("agent")) roles.push("agent");

        super({ ...fields, roles });

        
    }

    toJSON() {
        const json = {
            ...super.toJSON(),
        };

        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );

        return json;
    }
}

module.exports = Agent;
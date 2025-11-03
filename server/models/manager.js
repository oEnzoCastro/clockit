import { User } from './user.js';


class Manager extends User{
    constructor(fields = {}){
        const roles = fields.roles || [];
        if (!fields.roles.includes("AreaManager")) fields.roles.push("AreaManager");
        
        super({...fields,roles});
        this.areas = (fields.areas || []).map(s => new AreaManager({ ...s, manager_id: this.id }));

    }

     toJSON(){
        const json = {
            ...super.toJSON(),
            areas:this.areas.map(s=> s.toJSON())
        }

        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );

        return json;
    }
}

module.exports = User;
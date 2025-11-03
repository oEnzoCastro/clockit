

class Director extends Manager {
    constructor(fields = {}) {
        const roles = fields.roles || [];

        if (!roles.includes("director")) roles.push("director");

        super({ ...fields, roles });

    }

    toJSON() {
        {
            const json = {
                ...super.toJSON()
            };
            Object.keys(json).forEach(
                key => (json[key] === undefined || json[key] === null) && delete json[key]
            );

            return json;
        }
    }
}
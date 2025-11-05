const BaseModel = require('./baseModel');

class AreaManager extends BaseModel {
    constructor(fields = {}) {
        super(fields,
            ["manager_id", "area_id"],
            {
                // No string length validations needed here unless you want to validate UUIDs or extra fields
            }
        );
        this.manager_id = fields.manager_id;
        this.area_id = fields.area_id;

        // Make PK fields immutable
        Object.defineProperty(this, 'manager_id', { writable: false });
        Object.defineProperty(this, 'area_id', { writable: false });
    }

    toJSON() {
        const json = {
            manager_id: this.manager_id,
            area_id: this.area_id,
            ...super.toJSON()
        };
        return json;
    }
}

module.exports = AreaManager;

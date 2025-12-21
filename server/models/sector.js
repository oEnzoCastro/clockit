const BaseModel = require('./baseModel');
class Sector extends BaseModel {
    constructor(fields = {}) {
        super(fields,
            [ "area_id", "acronym", "sector_name"],
            {
                area_acronym: { min: 1, max: 10 },
                sector_name: { min: 1, max: 150 },
                acronym: { min: 1, max: 10 }
            });
        this.id = fields.id;
        this.area_id = fields.area_id;
        this.acronym = fields.acronym.toUpperCase();
        this.sector_name = fields.sector_name;
        this.is_hidden = fields.is_hidden;
        Object.defineProperty(this, 'institute_id', { writable: false });
        Object.defineProperty(this, 'area_acronym', { writable: false });
    }

    toJSON() {
        const json = {
            id:this.id,
            area_id: this.area_acronym,
            acronym: this.acronym,
            sector_name: this.sector_name,
            is_hidden:this.is_hidden,
            ...super.toJSON()
        }

       Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );
        return json;
    }
}
module.exports = Sector;
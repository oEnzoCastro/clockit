

class Sector extends BaseModel {
    constructor(fields = {}) {
        super(fields,
            ["institute_id", "area_acronym", "acronym", "sector_name"],
            {
                area_acronym: { min: 1, max: 10 },
                sector_name: { min: 1, max: 150 },
                acronym: { min: 1, max: 10 }
            });
        this.institute_id = fields.institute_id;
        this.area_acronym = fields.area_acronym;
        this.acronym = fields.acronym;
        this.sector_name = fields.sector_name;
        Object.defineProperty(this, 'institute_id', { writable: false });
        Object.defineProperty(this, 'area_acronym', { writable: false });
    }

    toJSON() {
        const json = {
            institute_id: this.institute_id,
            area_acronym: this.area_acronym,
            acronym: this.acronym,
            sector_name: this.sector_name,
            ...super.toJSON()
        }

       Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );
        return json;
    }
}
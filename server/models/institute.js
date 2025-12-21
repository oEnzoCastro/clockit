const BaseModel = require('./baseModel');


class Institute extends BaseModel {

    constructor(fields = {}) {

        super(fields,
            [ "acronym", "institute_name"],
            {
                acronym: { min: 1, max: 10 },
                institute_name: { min: 1, max: 150 }
            }
        )

        this.id = fields.id;
        this.acronym = fields.acronym.toUpperCase();
        this.institute_name = fields.institute_name;
        Object.defineProperty(this, 'id', { writable: false });
        Object.defineProperty(this, 'acronym', { writable: false });

    }

    toJSON() {

        const json = {
            id: this.id,
            acronym: this.acronym,
            institute_name: this.institute_name,
            ...super.toJSON()
        };

        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );
        return json;
    }

}

module.exports = Institute;
const BaseModel = require('./baseModel');


class Area extends BaseModel {
  constructor(fields = {}) {
    super(fields,
      ["institute_id", "acronym", "area_name"],
      {
        acronym: { min: 1, max: 100 },
        area_name: { min: 1, max: 100 }
      }
    );
    this.id = fields.id;
    this.area_name = fields.area_name;
    this.institute_id = fields.institute_id;
    this.acronym = fields.acronym;
    this.max_workload = fields.max_workload || 200;
    this.is_hidden = fields.is_hidden;
    Object.defineProperty(this, 'acronym', { writable: false });
    Object.defineProperty(this, 'institute_id', { writable: false });

  }

  toJSON() {
    const json = {
      id:this.id,
      acronym: this.acronym,
      area_name: this.area_name,
      institute_id: this.institute_id,
      max_workload: this.max_workload,
      is_hidden: this.is_hidden,
      ...super.toJSON()
    }

    Object.keys(json).forEach(
      key => (json[key] === undefined || json[key] === null) && delete json[key]
    );
    return json;

  }
}
module.exports = Area;
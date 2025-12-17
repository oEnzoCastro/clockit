const BaseModel = require('./baseModel');

class User extends BaseModel {
    constructor(fields = {}) {
        if(fields.password_hash){
             fields.password = fields.password_hash;
        }

   
        const requiredFields = ["first_name", "email", "password","institute_id"];
        

        
        super(fields, requiredFields, {
            first_name: { min: 3, max: 100 },
            surname: { min: 0, max: 100 } 
        });

        this.id = fields.id;
        this.first_name = fields.first_name;
        this.surname = fields.surname || null;
        this.email = fields.email;
        this.area = fields.area||null;
        this.password = fields.password||fields.password_hash;
        this.institute_id = fields.institute_id || null;
        this.code = fields.code || null;
        this.institute_role = fields.institute_role || null;

        // Make immutable fields
        Object.defineProperty(this, "id", { writable: false });
        Object.defineProperty(this, "email", { writable: false });
        
    }

    toJSON() {
        const json = {
            id: this.id,
            code: this.code,
            first_name: this.first_name,
            surname: this.surname,
            area:this.area?this.area.toJSON : null,
            password:this.password,
            email: this.email,
            institute_id: this.institute_id,
            institute_role: this.institute_role,
            ...super.toJSON()
        };

        // Remove null/undefined keys
        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );

        return json;
    }

    hasRole(role) {
        return this.role = role;
    }

    
}

module.exports = User;
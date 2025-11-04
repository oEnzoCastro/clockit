const BaseModel = require('./baseModel');

class User extends BaseModel {
    constructor(fields = {}) {
        // Ensure roles is always an array
        fields.roles = Array.isArray(fields.roles) ? fields.roles : [];

        // Define required fields based on role
        const requiredFields = ["first_name", "email", "password_hash","institute_id"];
        

        
        super(fields, requiredFields, {
            first_name: { min: 3, max: 100 },
            surname: { min: 0, max: 100 } 
        });

        this.id = fields.id;
        this.first_name = fields.first_name;
        this.surname = fields.surname || null;
        this.email = fields.email;
        this.password_hash = fields.password_hash;
        this.institute_id = fields.institute_id || null;
        this.code = fields.code || null;
        this.roles = fields.roles;

        // Make immutable fields
        Object.defineProperty(this, "id", { writable: false });
        Object.defineProperty(this, "email", { writable: false });
        Object.defineProperty(this, "roles", { writable: false });
    }

    toJSON() {
        const json = {
            id: this.id,
            code: this.code,
            first_name: this.first_name,
            surname: this.surname,
            password_hash:this.password_hash,
            email: this.email,
            institute_id: this.institute_id,
            roles: this.roles,
            ...super.toJSON()
        };

        // Remove null/undefined keys
        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );

        return json;
    }

    hasRole(role) {
        return this.roles.includes(role);
    }

    isDirector() {
        return this.hasRole("director");
    }
}

module.exports = User;
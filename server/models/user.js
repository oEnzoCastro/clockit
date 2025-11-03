import { BaseModel } from './baseModel.js';


class User extends BaseModel {
    constructor(fields = {}) {
        fields.roles = fields.roles || [];
        if (Array.isArray(fields.roles) && fields.roles.includes("director")) {
            super(fields,
                ["id", "first_name", "email", "password_hash", "institute_id"],
                {
                    first_name: { min: 3, max: 100 },
                    surname: { min: 3, max: 100 }
                }
            )
        } else {
            super(fields,
                ["id", "first_name", "email", "password_hash"],
                {
                    first_name: { min: 3, max: 100 },
                    surname: { min: 3, max: 100 }
                }
            )
        }

        this.id = fields.id;
        this.first_name = fields.first_name;
        this.surname = fields.surname;
        this.email = fields.email;
        this.id = fields.id;
        this.email = fields.email;
        this.password_hash = fields.password_hash;
        this.institute_id = fields.institute_id;
        this.code = fields.code;
        this.roles = fields.roles || [];
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
            email: this.email,
            institute_id: this.institute_id,
            roles: this.roles,
            ...super.toJSON()
        };

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
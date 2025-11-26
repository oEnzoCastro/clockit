const BaseModel = require('./baseModel');


class UserToken extends BaseModel {
    constructor(fields = {}) {
        super(
            fields,
            ["user_id", "token"],
            {
                client_type: { min: 1, max: 50 },
                device_id: { min: 1, max: 50 }
            }
        );

        this.id = fields.id;
        this.user_id = fields.user_id;
        this.token = fields.token;
        this.client_type = fields.client_type?.trim();
        this.device_id = fields.device_id?.trim();
        this.revoked = fields.revoked || false;
        this.expires_at = fields.expires_at;
        this.created_at = fields.created_at;
        this.updated_at = fields.updated_at;

        Object.defineProperty(this, "id", { writable: false });
        Object.defineProperty(this, "user_id", { writable: false });
        Object.defineProperty(this, "token", { writable: false });
    }


    toJSON() {
        const json = {
            id: this.id,
            user_id: this.user_id,
            token: this.token,
            device_id: this.device_id,
            client_type: this.client_type,
            revoked: this.revoked,
            expires_at: this.expires_at,
            created_at: this.created_at,
            updated_at: this.updated_at,
            ...super.toJSON()
        };

        // Remove undefined or null values
        Object.keys(json).forEach(
            key => (json[key] === undefined || json[key] === null) && delete json[key]
        );

        return json;
    }


}

module.exports = UserToken;
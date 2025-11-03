import { BaseModel } from './baseModel.js';


class UserToken extends BaseModel {
    constructor(fields = {}) {
        super(fields,
            ["id", "user_id", "token"],
            {
                client_type: { min: 1, max: 50 },
                device_id: { min: 1, max: 50 }
            }
        )

        this.id = fields.id;
        this.user_id = fields.user_id;
        this.token = fields.token;
        this.client_type = fields.client_type?.trim();
        this.device_id = fields.device_id?.trim();
        this.revoked = fields.revoked || false;
        Object.defineProperty(this, 'token', { value: this.token, writable: false });
        Object.defineProperty(this, 'id', { value: this.token, writable: false });
        Object.defineProperty(this, 'user_id', { value: this.token, writable: false });
    }

    toJSON() {
        const json = {
            id: this.id,
            user_id: this.user_id,
            device_id: this.device_id,
            client_type: this.client_type,
            revoked: this.revoked,
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
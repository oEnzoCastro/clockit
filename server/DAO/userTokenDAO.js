const db = require('../database/db');
const UserDAO = require('./userDAO');
const UserToken = require('../models/userToken');

class UserTokenDAO {

    constructor(db) {
        this.db = db;
        this.userDAO = new UserDAO(db);
    }

    // ------------------- CREATE -------------------
    async create(userToken) {
        const trx = await this.db.transaction();
        try {
            if (!(userToken instanceof UserToken))
                throw new Error("userToken must be an instance of UserToken");

            const user = await this.userDAO.getUserById(userToken.user_id);
            if (!user) throw new Error("User does not exist");

            // expires_at agora é 7 dias
            const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            const [inserted] = await trx("user_token")
                .insert({ ...userToken.toJSON(), expires_at, type: 'refresh' })
                .returning("*");

            if (!inserted) throw new Error("Failed to insert userToken");

            await trx.commit();
            return new UserToken(inserted);

        } catch (err) {
            console.error("Error in UserToken DAO create");
            await trx.rollback();
            throw err;
        }
    }

    // ------------------- FIND TOKEN -------------------
    async findToken(userId, token, trx = this.db) {
        const stored = await trx("user_token")
            .where({ user_id: userId, token, type: 'refresh', revoked: false })
            .first();
        return stored ? new UserToken(stored) : null;
    }

    // ------------------- CLEAN EXPIRED -------------------
    async cleanExpired() {
        const trx = await this.db.transaction();
        try {
            const deletedCount = await trx("user_token")
                .where("expires_at", "<", new Date())
                .del();

            await trx.commit();
            return deletedCount > 0;
        } catch (err) {
            console.error("Error in UserToken DAO cleanExpired");
            await trx.rollback();
            throw err;
        }
    }

    // ------------------- CLEAN REVOKED -------------------
    async cleanRevoked() {
        const trx = await this.db.transaction();
        try {
            const deletedCount = await trx("user_token")
                .where("revoked", true)
                .del();

            await trx.commit();
            return deletedCount > 0;
        } catch (err) {
            console.error("Error in UserToken DAO cleanRevoked");
            await trx.rollback();
            throw err;
        }
    }

    // ------------------- REFRESH TOKEN -------------------
    async refreshToken(token) {
        const trx = await this.db.transaction();
        try {
            const valid = await this.isValid(token, trx);
            if (!valid) throw new Error("Token is either expired or revoked");

            const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            const [updated] = await trx("user_token")
                .where({ token })
                .update({ expires_at })
                .returning("*");

            if (!updated) return null;

            await trx.commit();
            return new UserToken(updated);
        } catch (err) {
            console.error("Error in UserToken DAO refreshToken");
            await trx.rollback();
            throw err;
        }
    }

    // ------------------- INVALIDATE -------------------
    async invalidate(token) {
        const trx = await this.db.transaction();
        try {
            const [recieved_token] = await trx("user_token")
                .where({ token })
                .update({ revoked: true })
                .returning("*");

            if (!recieved_token) {
                await trx.rollback();
                return false;
            }

            await trx.commit();
            return true;
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }

    // ------------------- CHECK EXPIRED -------------------
    async isExpired(token, trx = this.db) {
        const expired_token = await trx("user_token").where({ token }).first();
        if (!expired_token) throw new Error("Token does not exist");
        return expired_token.expires_at <= new Date();
    }

    // ------------------- CHECK VALID -------------------
    async isValid(token, trx = this.db) {
        const valid_token = await trx("user_token").where({ token }).first();
        if (!valid_token) throw new Error("Token does not exist");

        const notExpired = valid_token.expires_at > new Date();
        const notRevoked = !valid_token.revoked;

        return notExpired && notRevoked;
    }

    // ------------------- CHECK REVOKED -------------------
    async isRevoked(token, trx = this.db) {
        const revoked_token = await trx("user_token").where({ token }).first();
        if (!revoked_token) throw new Error("Token does not exist");
        return revoked_token.revoked;
    }
}

module.exports = UserTokenDAO;
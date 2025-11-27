const db = require('../database/db');
const UserDAO = require('./userDAO');
const UserToken = require('../models/userToken');

class UserTokenDAO {

    constructor(db) {
        this.db = db;
        this.userDAO = new UserDAO(db);
    }

    async create(userToken) {
        const trx = await this.db.transaction();
        try {
            if (!(userToken instanceof UserToken))
                throw new Error("userToken must be an instance of UserToken");

            const user = await this.userDAO.getUserById(userToken.user_id);
            if (!user) throw new Error("User does not exist");

            const expires_at = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

            const [inserted] = await trx("user_token")
                .insert({ ...userToken.toJSON(), expires_at })
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

    async refreshToken(token) {
        const trx = await this.db.transaction();
        try {
            const valid = await this.isValid(token, trx);
            if (!valid) throw new Error("Token is either expired or revoked");

            const expires_at = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

            const [updated] = await trx("user_token")
                .where({ token })
                .update({ expires_at })
                .returning("*");

            if (!updated) throw new Error("Token does not exist");

            await trx.commit();
            return new UserToken(updated);
        } catch (err) {
            console.error("Error in UserToken DAO refreshToken");
            await trx.rollback();
            throw err;
        }
    }

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

    async isExpired(token, trx = this.db) {
        try {
            const expired_token = await trx("user_token").where({ token }).first();
            if (!expired_token) throw new Error("Token does not exist");
            return expired_token.expires_at <= new Date();
        } catch (err) {
            throw err;
        }
    }

    async isValid(token, trx = this.db) {
        try {
            const valid_token = await trx("user_token").where({ token }).first();
            if (!valid_token) throw new Error("Token does not exist");

            const notExpired = valid_token.expires_at > new Date();
            const notRevoked = !valid_token.revoked;

            return notExpired && notRevoked;
        } catch (err) {
            throw err;
        }
    }

    async isRevoked(token, trx = this.db) {
        try {
            const revoked_token = await trx("user_token").where({ token }).first();
            if (!revoked_token) throw new Error("Token does not exist");
            return revoked_token.revoked;
        } catch (err) {
            throw err;
        }
    }

    
}
/*
async function main() {
    const tokenDAO = new UserTokenDAO(db);

    try {
        console.log("=== TESTING UserTokenDAO ===");

        // 1. Create dummy token
        const testUserId = "dbdc7e29-60f1-4e9a-a72f-a89ed0d57aae"; // Ensure this user exists in your DB
        const dummyToken = new UserToken({
            user_id:  "dbdc7e29-60f1-4e9a-a72f-a89ed0d57aae",
            token: "test-refresh-token",
            revoked: false
        });

        console.log("\n1. Creating token...");
        const created = await tokenDAO.create(dummyToken);
        console.log("Created token:", created);

        const tokenId = created.id;

        // 2. Check expired
        console.log("\n2. isExpired()...");
        const expired = await tokenDAO.isExpired(tokenId);
        console.log("Expired:", expired);

        // 3. Check revoked
        console.log("\n3. isRevoked()...");
        const revoked = await tokenDAO.isRevoked(tokenId);
        console.log("Revoked:", revoked);

        // 4. Check valid
        console.log("\n4. isValid()...");
        const valid = await tokenDAO.isValid(tokenId);
        console.log("Valid:", valid);

        // 5. Refresh token
        console.log("\n5. refreshToken()...");
        const refreshed = await tokenDAO.refreshToken(tokenId);
        console.log("Refreshed token:", refreshed);

        // 6. Invalidate
        console.log("\n6. invalidate()...");
        const invalidated = await tokenDAO.invalidate(tokenId);
        console.log("Invalidated:", invalidated);

        // 7. Clean revoked
        console.log("\n7. cleanRevoked()...");
        const cleanedRevoked = await tokenDAO.cleanRevoked();
        console.log("cleanRevoked:", cleanedRevoked);

        // 8. Clean expired
        console.log("\n8. cleanExpired()...");
        const cleanedExpired = await tokenDAO.cleanExpired();
        console.log("cleanExpired:", cleanedExpired);

        console.log("\n=== FINISHED TESTING ===\n");

    } catch (err) {
        console.error("MAIN ERROR:", err);
    } finally {
        await db.destroy(); // close knex connection
    }
}

main();*/

module.exports = UserTokenDAO;

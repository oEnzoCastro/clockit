const User = require("../models/user");
const UserDAO = require('./userDAO');

class DirectorDAO extends UserDAO {
    constructor(db) {
        super(db);
    }


    async findDirectors(filters = {}, trx = this.db) {
        try {
            const {
                id,
                email,
                first_name,
                surname,
                institute_id,
                code
            } = filters;

            const query = trx('users')
                .where({ institute_role: 'director' });

            if (id) query.where('id', id);
            if (email) query.where('email', email);
            if (first_name) query.where('first_name', first_name);
            if (surname) query.where('surname', surname);
            if (institute_id) query.where('institute_id', institute_id);
            if (code) query.where('code', code);

            const rows = await query;
            return rows.map(row => new User(row));

        } catch (error) {
            console.error('Error in findDirectors():', error);
            throw error;
        }
    }

    async getDirectorById(id) {
        const res = await this.findDirectors({ id });
        return res[0] || null;
    }

    async getDirectorsByInstitute(institute_id) {
        return this.findDirectors({ institute_id });
    }

    async getDirectorByCodeInstitute(code, institute_id) {
        const res = await this.findDirectors({ code, institute_id });
        return res[0] || null;
    }

    async getDirectors() {
        return this.findDirectors();
    }


    async create(userData) {
        if (!(userData instanceof User)) {
            throw new Error("create() expects a User instance");
        }

        userData.institute_role = 'director';
        return super.create(userData);
    }
}

module.exports = DirectorDAO;

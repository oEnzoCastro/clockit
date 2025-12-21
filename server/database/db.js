const knex = require('knex');
// No need to require 'pg' explicitly; knex loads it internally
const config = require('./knexFile');
const pg = require('pg');
const db = knex(config.development);

module.exports = db;

const { Sequelize } = require('sequelize');
const config = require('../config/database');

const dbConfig = config.mysql.development; // Use appropriate environment if needed

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});

module.exports = sequelize;

const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

async function createDatabase(dbName) {
  try {
    // Create the database
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, { type: QueryTypes.RAW });
    console.log(`Database '${dbName}' created or already exists.`);
  } catch (error) {
    console.error(`Error creating database '${dbName}':`, error);
    throw error; // Re-throw to handle it in the route
  }
}

async function useDatabase(dbName) {
  try {
    await sequelize.query(`USE \`${dbName}\``, { type: QueryTypes.RAW });
  } catch (error) {
    console.error(`Error switching to database '${dbName}':`, error);
    throw error; // Re-throw to handle it in the route
  }
}

module.exports = { createDatabase, useDatabase };

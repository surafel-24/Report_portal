// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
const fs = require('fs');
const path = require('path');
const config = require('../config/database');

// Get the environment and database dialect
const env = process.env.NODE_ENV || 'development';
const dbDialect = process.env.DB_DIALECT || 'mysql'; // Default to MySQL if not set

const db = {};

// Load and configure the appropriate database connection
if (dbDialect === 'mongodb') {
  const mongoose = require('./mongodb');
  db.mongoose = mongoose;
} else if (dbDialect === 'mysql') {
  const sequelize = require('./mysql');
  db.sequelize = sequelize;
  db.Sequelize = require('sequelize');
} else if (dbDialect === 'postgres') {
  const sequelize = require('./postgres');
  db.sequelize = sequelize;
  db.Sequelize = require('sequelize');
}

// Load models
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (db.sequelize) {
      // Check if the model is a function and then invoke it
      if (typeof model === 'function') {
        db[model.name] = model(db.sequelize, db.Sequelize.DataTypes);
      }
    } else if (db.mongoose) {
      // For Mongoose models, just add them directly
      db[model.modelName] = model;
    }
  });

module.exports = db;

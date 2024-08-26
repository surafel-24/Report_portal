const mongoose = require('mongoose');
const config = require('../config/database');

const dbConfig = config.mongodb.development; // Ensure correct environment is used

if (!dbConfig || !dbConfig.uri) {
  throw new Error('MongoDB URI is not defined in the configuration.');
}

mongoose.connect(dbConfig.uri, {

});

module.exports = mongoose;



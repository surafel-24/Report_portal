const mongoose = require('mongoose');

const dynamicSchema = new mongoose.Schema({
  // Define your schema fields here
});

const DynamicModel = mongoose.model('DynamicModel', dynamicSchema);

module.exports = DynamicModel;

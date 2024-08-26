'use strict';
module.exports = (sequelize, DataTypes) => {
  const DynamicModel = sequelize.define('DynamicModel', {
    // Define your attributes here
  }, {});
  return DynamicModel;
};

'use strict';
module.exports = (sequelize, DataTypes) => {
  const faves = sequelize.define('faves', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  faves.associate = function(models) {
    // associations can be defined here
    models.faves.belongsTo(models.user);
  
  };
  return faves;
};
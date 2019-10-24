'use strict';
module.exports = (sequelize, DataTypes) => {
  const fave = sequelize.define('fave', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER,
    height: DataTypes.STRING,
    weight: DataTypes.STRING,
    team: DataTypes.STRING
  }, {});
  fave.associate = function(models) {
    // associations can be defined here
  };
  return fave;
};
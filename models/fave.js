'use strict';
module.exports = (sequelize, DataTypes) => {
  const fave = sequelize.define('fave', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER
  }, {});
  fave.associate = function(models) {
    // associations can be defined here
    models.fave.belongsTo(models.user);
  };
  return fave;
};
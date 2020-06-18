'use strict';
module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING
  }, {});
  Token.associate = function(models) {
    // associations can be defined here
    Token.belongsTo(models.User, {foreignKey: 'userId', as: 'user'})
  };
  return Token;
};
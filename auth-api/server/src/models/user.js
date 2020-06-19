'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Role, { through: 'User_Roles', foreignKey: 'userId', otherKey: 'roleId'});
  };
  return User; 
};
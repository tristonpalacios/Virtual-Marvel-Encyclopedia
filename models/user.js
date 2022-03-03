'use strict';
const {
  Model
} = require('sequelize');
const users_heroes = require('./users_heroes');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.belongsToMany(models.hero, {through: 'users_heroes'})
      models.user.hasMany(models.comment)
    }
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
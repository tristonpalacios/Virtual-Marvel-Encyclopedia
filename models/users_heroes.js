'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_heroes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  users_heroes.init({
    userId: DataTypes.INTEGER,
    heroId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users_heroes',
  });
  return users_heroes;
};
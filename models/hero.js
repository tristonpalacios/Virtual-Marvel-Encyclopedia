'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hero extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.hero.belongsToMany(models.user, {through: 'users_heroes'})
      models.hero.hasMany(models.comment)
    }
  }
  hero.init({
    name: DataTypes.STRING,
    more_url: DataTypes.STRING,
    photo: DataTypes.STRING,
    marvelId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'hero',
  });
  return hero;
};
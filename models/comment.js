'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.comment.belongsTo(models.user)
      models.comment.belongsTo(models.hero)
    }
  }
  comment.init({
    userId: DataTypes.INTEGER,
    heroId: DataTypes.INTEGER,
    body: DataTypes.STRING,
    userName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};
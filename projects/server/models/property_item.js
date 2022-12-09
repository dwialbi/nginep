"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class PropertyItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyItem.belongsTo(models.Property)
      PropertyItem.hasMany(models.Images, { onDelete: "CASCADE" })
    }
  }
  PropertyItem.init(
    {
      item_name: DataTypes.STRING,
      description: DataTypes.STRING,
      capacity: DataTypes.STRING,
      price: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PropertyItem",
    }
  )
  return PropertyItem
}

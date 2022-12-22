"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Property.belongsTo(models.Categories)
      Property.belongsTo(models.Cities)
      Property.belongsTo(models.User)
      Property.hasMany(models.PropertyItem, { onDelete: "CASCADE" })
      Property.hasMany(models.PropertyFacilities)
      Property.hasMany(models.PropertyImage, { onDelete: "CASCADE" })
      Property.hasMany(models.Transaction)
    }
  }
  Property.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      rules: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Property",
    }
  )
  return Property
}

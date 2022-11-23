"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class PropertyFacilities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PropertyFacilities.belongsTo(models.Facilities)
      PropertyFacilities.belongsTo(models.Property)
    }
  }
  PropertyFacilities.init(
    {},
    {
      sequelize,
      modelName: "PropertyFacilities",
    }
  )
  return PropertyFacilities
}

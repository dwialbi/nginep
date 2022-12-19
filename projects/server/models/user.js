"use strict"
const { Model } = require("sequelize")
// const property = require("./property")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Transaction)
      // define association here
      // User.hasMany(models.Property)
    }
  }
  User.init(
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      gender: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      birthdate: DataTypes.DATE,
      profile_picture: DataTypes.STRING,
      is_verified: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      // ktp: DataTypes.STRING,
      role: { type: DataTypes.STRING, defaultValue: "user" },
      loginWith: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  )
  return User
}

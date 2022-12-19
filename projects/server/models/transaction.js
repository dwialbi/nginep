"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User)
      Transaction.belongsTo(models.PropertyItem)
    }
  }
  Transaction.init(
    {
      start_date: DataTypes.STRING,
      end_date: DataTypes.STRING,
      price: DataTypes.STRING,
      payment_proof: DataTypes.STRING,
      is_paid: DataTypes.BOOLEAN,
      is_accepted: DataTypes.BOOLEAN,
      is_cancelled: DataTypes.BOOLEAN,
      status: DataTypes.STRING,
      exp_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  )
  return Transaction
}

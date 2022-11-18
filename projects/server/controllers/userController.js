const db = require("../models")
const User = db.User

const userController = {
    getMyData: async (req, res) => {
        try {
            const findMyData = await User.findOne({
              where: {
                id: req.user.id  
              }
            })

            delete findMyData.dataValues.password

            res.status(200).json({
              message: "Find user by ID",
              data: findMyData,
            })
          } catch (err) {
            console.log(err)
            return res.status(500).json({
              message: "Server error",
            })
          }
    },

    updateMyData: async (req, res) => {
        try {
          await User.update(req.body, {
            where: {
              id: req.user.id
            }
          })
          res.status(200).json({
            message: "User updated",
          })
        } catch (err) {
          console.log(err)
          return res.status(500).json({
            message: "Server error",
          })
        }
      },
}

module.exports = userController

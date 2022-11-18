const db = require("../models")
const User = db.User
const bcrypt = require("bcrypt")
const { signToken } = require("../lib/jwt")
const { verifyGoogleToken } = require("../lib/firebase")

const authController = {
  registerUser: async (req, res) => {
    try {
      const { email, role } = req.body

      const findUserByEmail = await User.findOne({
        where: { email },
      })

      if (findUserByEmail) {
        return res.status(400).json({
          message: "Another account is using the same email",
        })
      }

      await User.create({
        email,
      })

      return res.status(201).json({
        message: "User registered",
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body

      const findUserByEmail = await User.findOne({
        where: { email },
      })

      if (!findUserByEmail) {
        return res.status(400).json({
          message: "User not found",
        })
      }

      const passwordValid = bcrypt.compareSync(
        password,
        findUserByEmail.password
      )

      if (!passwordValid) {
        return res.status(400).json({
          message:
            "Sorry, your password was incorrect. Please double-check your password.",
        })
      }

      delete findUserByEmail.dataValues.password

      const token = signToken({
        id: findUserByEmail.id
      })

      return res.status(201).json({
        message: "User logged in",
        data: findUserByEmail,
        token
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  refreshToken: async (req, res) => {},
  loginWithGoogle: async (req, res) => {
    try {
      const { googleToken } = req.body

      const {email} = await verifyGoogleToken(googleToken)

      const [user, created] = await User.findOrCreate({
        where: { email },
      })

      const token = signToken({
        id: user.id
      })

      return res.status(201).json({
        message: "User logged in",
        data: user,
        token
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
}

module.exports = authController

const express = require("express")
const authController = require("../controllers/authController")
const tenantController = require("../controllers/tenantController")
const { verifyToken } = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/register", authController.registerUser)

router.get("/refresh-token", verifyToken, authController.refreshToken)
router.post("/login/google", authController.loginWithGoogle)

module.exports = router

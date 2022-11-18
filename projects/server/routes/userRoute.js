const express = require("express")
const userController = require("../controllers/userController")
const router = express.Router()

router.get("/", userController.getMyData)
router.patch("/", userController.updateMyData)

module.exports = router
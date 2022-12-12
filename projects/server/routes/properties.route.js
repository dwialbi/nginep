const express = require("express")
const { getAllCategories } = require("../controllers/propertiesController")
const propertyController = require("../controllers/propertiesController")
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")

const router = express.Router()

router.post(
  "/",
  verifyToken,
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "property_img",
  }).array("image_url", 6),
  propertyController.propertyPost
)

router.get("/:id", propertyController.getPropertyById)

router.patch("/edit/:id", propertyController.propertyUpdate)

router.delete("/delete/:id", propertyController.propertyDelete)

router.delete("/delete/image/:id", propertyController.propertyImageDelete)

router.post(
  "/image/:id",
  // verifyToken,
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "image_url",
  }).single("image_url"),
  propertyController.propertyImagePost
)

module.exports = router

const express = require("express")
const { getAllCategories } = require("../controllers/tenantController")
const tenantController = require("../controllers/tenantController")
const { upload } = require("../lib/uploader")
const { verifyToken } = require("../middlewares/authMiddleware")

const router = express.Router()

router.post(
  "/property",
  verifyToken,
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "image_url",
  }).array("image_url", 5),
  tenantController.TenantPropertyPost
)

router.get("/property/:id", tenantController.getPropertyById)

router.patch("/property/:id", tenantController.TenantPropertyUpdate)

router.delete("/property/:id", tenantController.TenantPropertyDelete)

router.delete("/property/image/:id", tenantController.TenantPropertyImageDelete)

router.get("/category", tenantController.getAllCategories)
router.get("/cities", tenantController.getAllCities)

router.post(
  "/property/image/:id",
  // verifyToken,
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "image_url",
  }).single("image_url"),
  tenantController.TenantPropertyImagePost
)

module.exports = router

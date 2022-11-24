const express = require("express")
const tenantController = require("../controllers/tenantController")
const { upload } = require("../lib/uploader")

const router = express.Router()

router.post(
  "/property",
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "image_url",
  }).array("image_url", 5),
  tenantController.TenantPropertyPost
)

router.patch("/property/:id", tenantController.TenantPropertyUpdate)

router.delete("/property/:id", tenantController.TenantPropertyDelete)

router.delete("/property/image/:id", tenantController.TenantPropertyImageDelete)

router.post(
  "/property/image",
  upload({
    acceptedFileTypes: ["png", "jpeg", "jpg"],
    filePrefix: "image_url",
  }).array("image_url", 5),
  tenantController.TenantPropertyImagePost
)

module.exports = router

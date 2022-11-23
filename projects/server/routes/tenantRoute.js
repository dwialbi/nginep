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

module.exports = router

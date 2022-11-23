const db = require("../models")
const { Op } = require("sequelize")
const { sequelize } = require("../models")
// const path = require("path")

const tenantController = {
  TenantPropertyPost: async (req, res) => {
    const newProperty = await sequelize.transaction()
    try {
      const foundCityById = await db.Cities.findByPk(req.body.cityId)
      const foundCategoryById = await db.Categories.findByPk(
        req.body.categoryId
      )

      if (!foundCityById || !foundCategoryById) {
        throw new Error("cities and category is not found")
      }

      const createdNewProperty = await db.Property.create(
        {
          name: req.body.name,
          address: req.body.address,
          description: req.body.description,
          CityId: foundCityById.id,
          CategoryId: foundCategoryById.id,
          UserId: "53", // dummy
          // UserId: req.User.id
        },
        { transaction: newProperty }
      )

      //======================== IMG DUMMY ======================================
      // CONTOH DUMMY IMG
      const img_url = ["123", "2", "3", "4"]

      //========================== BUNTU ========================================
      // if (res.send(req.files)) {
      // if (req.files) {
      //   const { path } = req.files
      //   console.log(path)
      //   const img_path = []
      //   // const img = `http://localhost:8000/public/propImg/${req.files.filename}`
      //   for (let i = 0; i < req.files.length; i++) {
      //     // console.log(img_path)
      //     // console.log(typeof req.files[i].path)
      //     // img_path.push()
      //     await db.PropertyImage.create({
      //       image_url: req.files[i].path,
      //       PropertyId: createdNewProperty.id,
      //     })
      //   }
      // }
      // ========================BUlkCreate===========================================================
      const files = req.files
      let img_path = []

      img_path = files.map((item) => item.path)
      const propId = createdNewProperty.id
      const newPropImg = img_path.map(
        (item) => {
          return { image_url: item, PropertyId: propId }
        },
        { transaction: newProperty }
      )
      await db.PropertyImage.bulkCreate(newPropImg)
      //========================== Dummy ========================================

      // for (let i = 0; i < img_url.length; i++) {
      //   await db.PropertyImage.create(
      //     {
      //       image_url: img_url[i],
      //       PropertyId: createdNewProperty.id,
      //     },
      //     { transaction: newProperty }
      //   )
      // }
      await newProperty.commit()

      const foundPropertyById = await db.Property.findByPk(
        createdNewProperty.id,
        {
          include: [db.PropertyImage, db.User],
        }
      )

      return res.status(201).json({
        message: "Post new product",
        data: foundPropertyById,
      })
    } catch (err) {
      console.log(err)
      await newProperty.rollback()
      return res.status(500).json({
        message: err.message,
      })
    }
  },
}

module.exports = tenantController

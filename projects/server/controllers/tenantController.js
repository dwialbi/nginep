const db = require("../models")
const { Op } = require("sequelize")
const { sequelize } = require("../models")
const User = db.User
// const path = require("path")

const tenantController = {
  TenantPropertyPost: async (req, res) => {
    // const newProperty = await sequelize.transaction()
    try {
      const foundCityById = await db.Cities.findByPk(req.body.cityId)
      const foundCategoryById = await db.Categories.findByPk(
        req.body.categoryId
      )
      const foundUserById = await db.User.findByPk(req.user.id)

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
          // UserId: "53", // dummy
          UserId: foundUserById.id,
        }
        // { transaction: newProperty }
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

      if (files) {
        req.body.image_url = `http://localhost:8000/public/propImg/${req.files.filename}`

        img_path = files.map((item) => item.path)
        const propId = createdNewProperty.id
        const newPropImg = img_path.map(
          (item) => {
            return {
              image_url: `http://localhost:8000/${item}`,
              PropertyId: propId,
            }
          }
          // { transaction: newProperty }
        )
        await db.PropertyImage.bulkCreate(newPropImg)
      }
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

      const foundPropertyById = await db.Property.findByPk(
        createdNewProperty.id,
        {
          include: [db.PropertyImage, db.User],
        }
      )
      // await newProperty.commit()

      return res.status(201).json({
        message: "Post new product",
        data: foundPropertyById,
      })
    } catch (err) {
      console.log(err)
      // await newProperty.rollback()
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  TenantPropertyUpdate: async (req, res) => {
    try {
      // const { id } = req.params
      // disimpan dalam vairabel dan akan dapat respon

      //

      await db.Property.findOne({
        where: {
          id: req.params.id,
        },
      })

      await db.Property.update(
        { ...req.body },
        {
          where: {
            id: req.params.id,
          },
        }
      )

      // beda function
      // await db.PropertyImage.update(req.body, {
      //   where: {
      //     id: id,

      //     // propertyId:id
      //   },
      // })

      return res.status(200).json({
        message: "Property update",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  TenantPropertyDelete: async (req, res, next) => {
    try {
      await db.Property.destroy({
        where: {
          id: req.params.id,
        },
      })

      return res.status(200).json({
        message: "Property deleted",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  TenantPropertyImageDelete: async (req, res) => {
    try {
      await db.PropertyImage.destroy({
        where: {
          id: req.params.id,
        },
      })
      return res.status(200).json({
        message: "Image deleted",
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  TenantPropertyImagePost: async (req, res) => {
    try {
      await db.Property.findOne({
        where: {
          id: req.params.id,
        },
      })

      const newImgProp = await db.PropertyImage.create({
        image_url: `http://localhost:8000/public/propImg/${req.file.filename}`,
        PropertyId: req.params.id,
      })

      console.log(req.file.filename)
      return res.status(201).json({
        message: "Post new Image Property",
        data: newImgProp,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: req.message,
      })
    }
  },
  getAllCategories: async (req, res) => {
    try {
      const showAllCategory = await db.Categories.findAll()

      return res.status(200).json({
        data: showAllCategory,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: err.message,
      })
    }
  },
  getAllCities: async (req, res) => {
    try {
      const showAllCities = await db.Cities.findAll()

      return res.status(200).json({
        data: showAllCities,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: err.message,
      })
    }
  },
  getPropertyById: async (req, res) => {
    try {
      const findPropById = await db.Property.findByPk(req.params.id, {
        include: [{ model: db.PropertyImage }],
      })

      return res.status(200).json({
        message: "Get Property",
        data: findPropById,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: res.message,
      })
    }
  },
}

module.exports = tenantController

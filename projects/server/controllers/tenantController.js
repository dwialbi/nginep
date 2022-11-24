const db = require("../models")
const { Op } = require("sequelize")
const { sequelize } = require("../models")
// const path = require("path")

const tenantController = {
  TenantPropertyPost: async (req, res) => {
    // const newProperty = await sequelize.transaction()
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

      img_path = files.map((item) => item.path)
      const propId = createdNewProperty.id
      const newPropImg = img_path.map(
        (item) => {
          return { image_url: item, PropertyId: propId }
        }
        // { transaction: newProperty }
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
      // const foundPropById = await db.Property.findByPk(req.params.PropertyId)

      return sequelize
        .transaction((t) => {
          return db.Property.destroy(
            {
              where: {
                id: req.params.id,
              },
            },
            { transaction: t }
          ).then(() => {
            return db.PropertyImage.destroy(
              {
                where: {
                  PropertyId: req.params.id,
                },
              },
              { transaction: t }
            ).then((deletedImg) => {
              return deletedImg
            })
          })
        })
        .then((result) => {
          // console.log(result)
          return res.status(200).json({
            message: "Property deleted",
            result,
          })
          // .catch((err) => {
          //   return next(err)
          // })
        })
      // ======================================================================
      // await db.PropertyImage.destroy({
      //   where: {
      //     id: foundPropById.id,
      //   },
      // })
      // ======================================================================
      // return res.status(200).json({
      //   message: "Property delete",
      // })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  TenantPropertyImageDelete: async (req, res) => {
    try {
      // const findPropertyById = await db.Property.findByPk(req.property.id)

      // if (!findPropertyById) {
      //   return res.status(400).json({
      //     message: "",
      //   })
      // }

      await db.PropertyImage.destroy({
        where: {
          id: req.params.id,
        },
      })
      return res.status(200).json({
        message: "Image delete",
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
      const files = req.files
      let img_path = []

      img_path = files.map((item) => item.path)
      const propId = db.Property.id
      const newPropImg = img_path.map((item) => {
        return { image_url: item, PropertyId: propId }
      })
      await db.PropertyImage.bulkCreate(newPropImg)

      const foundPropertyById = await db.Property.findByPk(db.Property.id, {
        include: [{ model: db.PropertyImage }, { model: db.User }],
      })

      console.log(foundPropertyById)

      return res.status(201).json({
        message: "Post new product",
        data: foundPropertyById,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: req.message,
      })
    }
  },
}

module.exports = tenantController

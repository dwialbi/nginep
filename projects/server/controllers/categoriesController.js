const db = require("../models")

const categoryController = {
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
}

module.exports = categoryController

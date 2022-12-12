const db = require("../models")

const cityController = {
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
}

module.exports = cityController

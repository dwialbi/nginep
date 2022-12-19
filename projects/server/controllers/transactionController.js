const moment = require("moment")
const db = require("../models")
const schedule = require("node-schedule")

const transactionController = {
  paymentProof: async (req, res) => {
    try {
      const expDate = await db.Transaction.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ["exp_date"],
      })
      const expDateValue = Object.values(expDate.dataValues)
      // const currentDate = moment().format("YYYY-MM-DD hh:mm:ss")
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss")
      // .toDate()
      const dateNow = moment(expDateValue[0])
        .add(-7, "hours")
        .format("YYYY-MM-DD HH:mm:ss")
      // .toDate()
      // const compareDate = moment(currentDate).isAfter(date)

      const compareExp = moment(expDateValue[0]).unix()
      // const compareExp = moment(db.Transaction.exp_date).unix()
      const compareCur = moment(currentDate).unix()

      const countDown = compareExp - compareCur

      console.log(currentDate)
      console.log(dateNow)
      // const start = new Date(Date.now() === currentDate)
      // console.log(start)

      if (currentDate > dateNow) {
        // throw new Error("INI ERROR LO :)), HEHEHE")
        return res.json({
          status: "error",
          message: "INI ERROR LOO :), HEHEHE",
        })
      }

      // console.log(expDateValue)
      // console.log(currentDate)
      // // console.log(date)

      const postImg = await db.Transaction.update(
        {
          payment_proof: req.file.filename,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
      // console.log(postImg)
      return res.status(200).json({
        message: "Payment successful",
        data: postImg,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: err.message,
      })
    }
  },
  createPayment: async (req, res) => {
    try {
      // const date = moment().add(2, "hours").format("YYYY-MM-DD hh:mm:ss")
      // const date = moment().add(2, "hours").format("LLL")
      const date = moment().add(9, "hours").format("YYYY-MM-DD HH:mm:ss")
      // const date = moment().add(2, "hours").unix()

      console.log(date)
      // console.log(req.body)
      // process.exit()
      const test = await db.Transaction.create({
        start_date: "halo",
        end_date: "halo",
        price: 1000,
        PropertyItemId: 1,
        UserId: 68,
        exp_date: date,
        status: "waiting for payment",
      })

      return res.status(200).json({
        message: "create transaction",
        data: test,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: "Server error",
      })
    }
  },
  getTest: async (req, res) => {
    try {
      const get = await db.Transaction.findOne({
        where: {
          id: req.params.id,
        },
        attributes: ["exp_date", "price"],
      })

      const date = Object.values(get.dataValues)
      const getPrice = Object.values(get.dataValues)
      const price = getPrice[1]
      console.log(price)
      // const date = db.Transaction.exp_date
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss")
      const dateNow = moment(date[0])
        .add(-7, "hours")
        .format("DD-MM-YYYY, HH:mm ")

      const job = schedule.scheduleJob("1 * * * *", () => {
        console.log("haiii")
      })
      job.invoke()

      // console.log(date[0])
      console.log(currentDate)
      console.log(dateNow)

      if (currentDate > dateNow) {
        console.log("Hehe")
      } else {
        console.log("Haha")
      }

      // if (compareCur > compareExp) {
      //   console.log("Hehe")
      // } else {
      //   console.log("Haha")
      // }

      // const data = moment(currentDate).isAfter(date)

      // console.log(typeof currentDate)
      // console.log(typeof date)
      // console.log(currentDate)
      // console.log(date)
      // console.log(currentDate, diff(date, "minutes"))
      // console.log(data)

      return res.status(200).json({
        message: "Get countdown",
        dateNow,
        price,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        // message: "Server error upload payment",
        message: err.message,
      })
    }
  },
}

module.exports = transactionController

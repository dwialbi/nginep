const moment = require("moment")
const db = require("../models")
const fs = require("fs")
const emailer = require("../lib/emailer")
const schedule = require("node-schedule")
const automaticPaymentCheck = require("../schedule/paymentCheck")
const automaticSendMail = require("../schedule/reminderCheckin")
const handlebars = require("handlebars")
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
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss")
      const dateNow = moment(expDateValue[0])
        // .add(-7, "hours")
        .format("YYYY-MM-DD HH:mm:ss")

      console.log(currentDate)
      console.log(dateNow)

      // console.log(expDate)

      if (currentDate > dateNow) {
        return res.status(400).json({
          message: "your invoice is expired",
        })
        // throw new Error("Your invoice is expired")
      }

      const postImg = await db.Transaction.update(
        {
          payment_proof: req.file.filename,
          status: "waiting for tenant confirmation",
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )

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
      // const date = moment().add(2, "hours").unix()

      // console.log(date)
      // console.log(req.body)
      // process.exit()

      const date = moment().add(2, "hours").format("YYYY-MM-DD HH:mm:ss")
      const start = moment().add(3, "days").format("YYYY-MM-DD HH:mm:ss")
      const end = moment().add(5, "days").format("YYYY-MM-DD HH:mm:ss")

      const test = await db.Transaction.create({
        start_date: start,
        end_date: end,
        price: 1000,
        PropertyItemId: 1,
        PropertyId: 384,
        UserId: 60,
        exp_date: date,
        status: "waiting for payment",
      })

      automaticPaymentCheck(test)
      automaticSendMail(test)

      // schedule.scheduleJob(test.exp_date, automaticPaymentCheck(test))

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
        attributes: ["exp_date", "price", "status"],
      })

      const date = Object.values(get.dataValues)
      const getPrice = Object.values(get.dataValues)

      const price = getPrice[1]
      console.log(price)
      // const date = db.Transaction.exp_date
      const dateNow = moment(date[0]).add(-7, "hours").format("LLL")

      // console.log(date[0])

      return res.status(200).json({
        message: "Get countdown",
        get,
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
  transactionApprove: async (req, res) => {
    try {
      await db.Transaction.update(
        {
          status: "in progress",
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )

      const findTransactionData = await db.Transaction.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          { model: db.Property },
          { model: db.PropertyItem },
          { model: db.User },
        ],
      })

      // console.log(findTransactionData)
      const getStatus = Object.values(findTransactionData.dataValues)[5]

      const getUserEmail = Object.values(findTransactionData.User.dataValues)[2]

      const getPropName = Object.values(
        findTransactionData.Property.dataValues
      )[1]

      const getPropAddress = Object.values(
        findTransactionData.Property.dataValues
      )[2]

      const getPropRules = Object.values(
        findTransactionData.Property.dataValues
      )[4]

      const getRoomType = Object.values(
        findTransactionData.PropertyItem.dataValues
      )[1]

      const getRoomCapacity = Object.values(
        findTransactionData.PropertyItem.dataValues
      )[3]
      // console.log(getStatus)
      // console.log(getUserEmail)
      // console.log(getPropName)
      // console.log(getPropAddress)
      // console.log(getPropRules)
      // console.log(getRoomType)
      // console.log(getRoomCapacity)
      // console.log(findTransactionData)

      const rawHtml = fs.readFileSync("templates/remainderDetail.html", "utf-8")
      const compiledHTML = handlebars.compile(rawHtml)
      const htmlresult = compiledHTML({
        getPropName,
        getPropAddress,
        getPropRules,
        getRoomType,
        getRoomCapacity,
        getStatus,
      })

      // yumeekyoo
      // await emailer({
      //   to: getUserEmail,
      //   html: htmlresult,
      //   subect: "Your Booking Detail",
      //   text: "Hallo",
      // })

      return res.status(200).json({
        message: "payment approved",
        data: findTransactionData,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  transactionReject: async (req, res) => {
    try {
      await db.Transaction.update(
        {
          status: "waiting for payment",
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
      return res.status(200).json({
        message: "payment rejected",
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        message: err.message,
      })
    }
  },
  // 1. payment proof, start date, end date,propery name,
  //  room type, total price, User email
  // 2. confirmation
  getDataTransaction: async (req, res) => {
    try {
      const findTransactionData = await db.Transaction.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          { model: db.Property },
          { model: db.PropertyItem },
          { model: db.User },
        ],
      })

      return res.status(200).json({
        message: "Get user transaction",
        data: findTransactionData,
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        message: err.message,
      })
    }
  },

  getasu: async (req, res) => {
    try {
      const getUserEmail = await db.Transaction.findAll({
        where: {
          is_checked: 0,
        },
        include: [{ model: db.User, attributes: ["email"] }],
      })

      const getEmail = Object.values(getUserEmail)
      const ids = getEmail.map((item) => item.User.dataValues.email)
      // const userEmail = ids.map((val) => val.Object.values.email)
      // const email = Object.values(getEmail.User)[0]
      // const mail = Object.values(email)[0]

      console.log(ids)
      return res.status(200).json({
        message: "get all shit",
        data: ids,
      })
    } catch (err) {
      console.log(err)
    }
  },
}

module.exports = transactionController

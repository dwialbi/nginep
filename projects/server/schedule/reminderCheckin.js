const schedule = require("node-schedule")
const db = require("../models")
const moment = require("moment")
const { Op } = require("sequelize")
const fs = require("fs")
const emailer = require("../lib/emailer")
const handlebars = require("handlebars")

const checkinReminder = schedule.scheduleJob("0 * * * * *", async () => {
  const getStartDateAndUserEmail = await db.Transaction.findAll({
    where: {
      is_checked: 0,
    },
    attributes: ["start_date"],
    include: [{ model: db.User, attributes: ["email"] }],
  })

  const getEmail = Object.values(getStartDateAndUserEmail)
  const userEmail = getEmail.map((item) => item.User.dataValues.email)
  const getStartDate = getEmail.map((item) => item.dataValues.start_date)
  const generateStartDate = getStartDate.map((item) => item)

  console.log(generateStartDate)
  console.log(getStartDate)
  const getTransaction = await db.Transaction.findAll({
    where: {
      start_date: {
        [Op.lt]: moment(generateStartDate),
      },
      //   start_date: moment().add(-1, "days"),
      is_checked: 0,
    },
    include: [{ model: db.User, attributes: ["email"] }],
  })

  //   const minusOne =
  //     generateStartDate - moment().add(-1, "hours").format("YYYY-MM-DD HH:mm:ss")
  //   console.log(minusOne)
  console.log(getTransaction)

  //   console.log(getUserEmail)
  //   console.log(getTransaction)
  //   console.log(getUserEmail)

  //   const rawHtml = fs.readFileSync("templates/checkinRemainder.html", "utf-8")
  //   const compiledHTML = handlebars.compile(rawHtml)
  //   const htmlresult = compiledHTML({})
  //   await emailer({
  //     to: getUserEmail,
  //     html: htmlresult,
  //     subect: "Your Booking Detail",
  //     text: "Hallo",
  //   })
  const ids = getTransaction.map((item) => item.id)
  //   console.log(ids)

  //   await db.Transaction.update(
  //     {
  //       is_checked: true,
  //     },
  //     {
  //       where: {
  //         id: ids,
  //       },
  //     }
  //   )
})

checkinReminder.invoke()

module.exports = checkinReminder

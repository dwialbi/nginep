const schedule = require("node-schedule")
const db = require("../models")
const moment = require("moment")
const { Op } = require("sequelize")
const fs = require("fs")
const emailer = require("../lib/emailer")
const handlebars = require("handlebars")
// findID yg baru di buat, lihat status ketika udh confirm dan status isChecked false
// send email dan blm pernah di kirim email

const dummy = {
  id: 19,
}

const sendAutoEmail = async (objectTransaction) => {
  const getStartDate = objectTransaction.start_date
  const reminder = moment(getStartDate).subtract(1, "days")
  // const reminder = moment().add(1, "minutes")
  schedule.scheduleJob(new Date(reminder), async () => {
    try {
      const transactionData = await db.Transaction.findByPk(
        objectTransaction.id,
        {
          include: [{ model: db.User, attributes: ["email"] }],
        }
      )

      const getUserEmail = transactionData.User.email

      console.log(transactionData.status)
      console.log(!transactionData.is_checked)
      if (
        transactionData.status === "in progress" &&
        !transactionData.is_checked
      ) {
        const rawHtml = fs.readFileSync(
          "templates/checkinRemainder.html",
          "utf-8"
        )
        const compiledHTML = handlebars.compile(rawHtml)
        const htmlresult = compiledHTML()
        await emailer({
          to: getUserEmail,
          html: htmlresult,
          subect: "Your Booking Detail",
          text: "Hallo",
        })
      }

      await db.Transaction.update(
        {
          is_checked: 1,
        },
        {
          where: {
            id: transactionData.id,
          },
        }
      )
    } catch (err) {
      console.log(err)
    }
    // console.log("ableh cantik")
  })
}

// sendAutoEmail(dummy)
module.exports = sendAutoEmail

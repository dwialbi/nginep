const schedule = require("node-schedule")
const db = require("../models")
const moment = require("moment")
const { Op } = require("sequelize")

const job = schedule.scheduleJob("0 * * * * *", async () => {
  const getTransaction = await db.Transaction.findAll({
    where: {
      exp_date: {
        [Op.lt]: moment(),
      },
      status: "waiting for payment",
    },
  })
  // console.log(moment())

  const ids = getTransaction.map((item) => item.id)
  // console.log(ids)

  await db.Transaction.update(
    {
      status: "payment expired",
    },
    {
      where: {
        id: ids,
      },
    }
  )
})

module.exports = job

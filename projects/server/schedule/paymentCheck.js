const schedule = require("node-schedule")
const db = require("../models")
const moment = require("moment")
const { Op } = require("sequelize")

// createdAt ==> dengan moment untuk menambah
// parameter pertama dari scheduleJob di isi created At+2jam dari transaction
// yg sudah di bikin

// findOPne transaction yg baru terbuat dengan status waiting for payment
// query findOne di ekesekusi setelah 2 jam dari transaction terbuat
// schedule akan mengenerate schedleJob saat transaction terbuat

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

// module.exports = job

const paymentCheck = (objectTransaction) => {
  schedule.scheduleJob(objectTransaction.exp_date, async () => {
    const getTransaction = await db.Transaction.findByPk(objectTransaction.id)

    if (objectTransaction.status === "waiting for payment") {
      await db.Transaction.update(
        {
          status: "payment expired",
        },
        {
          where: {
            id: getTransaction.id,
          },
        }
      )
    }
  })
}

module.exports = paymentCheck

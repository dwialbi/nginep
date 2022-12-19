const schedule = require("node-schedule")
const db = require("../models")
const moment = require("moment")

const job = schedule.scheduleJob("0 * * * * *", async (req, res) => {
  //   const { id } = req.query
  const getTransaction = await db.Transaction.findByPk(id, {
    where: {
      id: req.params.id,
      //   status: "waiting for payment",
    },
    attributes: ["exp_date", "status"],
  })
  console.log(getTransaction)

  const getDate = Object(getTransaction.dataValues)
  const getStatus = Object(getTransaction.dataValues)
  const status = getStatus[1]
  const dateNow = moment(getDate[0])
    .add(-7, "hours")
    .format("DD-MM-YYYY, HH:mm ")

  //   console.log(getDate)
  //   console.log(getStatus)
  //   console.log("The answer to life, the universe, and everything!")
})

job.invoke()

// ================================================
// Schedule jalan per 5 menit katakanlah.

// Ini yg di lakuin sama jobnya
// - ambil data ke DB table transaction. Where status tidak fail / complete dan expDate > date
//  sekarang
// - kalo ada ambil semua IDnya dan panjut ke proses selanjutnya. Kalo ngga ada yaudah selesai
// - pake ID dr proses selanjutnya, buat update ke DB table transacrion. Jadiin statusnya jd failed
// - finish

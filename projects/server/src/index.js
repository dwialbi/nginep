require("dotenv/config")
const express = require("express")
const cors = require("cors")
const { join } = require("path")
const db = require("../models")
const fs = require("fs")
const schedule = require("../schedule/paymentCheck")
const emailer = require("../lib/emailer")

const PORT = process.env.PORT || 8000
const app = express()
// app.use(
//   cors({
//     origin: [
//       process.env.WHITELISTED_DOMAIN &&
//         process.env.WHITELISTED_DOMAIN.split(","),
//     ],
//   })
// )

app.use(cors())
app.use(express.json())

const authRoute = require("../routes/authRoute")
const userRoute = require("../routes/userRoute")
const propertiesRoute = require("../routes/properties.route")
const categoryRoute = require("../routes/categoriesRoute")
const cityRoute = require("../routes/cityRoute")
const transactionRoute = require("../routes/transactionRoute")
const { verifyToken } = require("../middlewares/authMiddleware")

app.use("/auth", authRoute)
app.use("/user", verifyToken, userRoute)
app.use("/property", verifyToken, propertiesRoute)
app.use("/category", categoryRoute)
app.use("/city", cityRoute)
app.use("/transaction", transactionRoute)

app.use("/public", express.static("public"))
//#region API ROUTES

// ===========================
// NOTE : Add your routes here
app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`)
})

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  })
})

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !")
  } else {
    next()
  }
})

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack)
    res.status(500).send("Error !")
  } else {
    next()
  }
})

//#endregion

//#region CLIENT
const clientPath = "../../client/build"
app.use(express.static(join(__dirname, clientPath)))

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"))
})

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`)
  } else {
    db.sequelize.sync({
      //  alter: true
      force: false,
    })

    if (!fs.existsSync("public")) {
      fs.mkdirSync("public")
    }
    console.log(`APP RUNNING at ${PORT} ✅`)
  }
})

// schedule.invoke()

const nodemailer = require("nodemailer")

const emailer = async ({ to, subject, text, html }) => {
  if (!to)
    throw new Error("Emailer need recipient email. `to` parameter is missing")

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nginepin9433@gmail.com",
      pass: "nnhxgbehhcijebch",
    },
    // secure: false,
    // port: 587,
  })
  await transporter.sendMail({
    to, //Email penerima
    subject, //Subject email
    text, //Body email dalam bentuk text
    html, //Body email dalam bentuk HTML
  })
}

module.exports = emailer

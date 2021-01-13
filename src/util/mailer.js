const { mailConfig, mailgunConfig } = require('../config/mail')
const nodemailer = require('nodemailer')
const domain = 'mg.pointhub.net'
const mailgun = require('mailgun-js')({ apiKey: mailgunConfig.apikey, domain: domain })

const devTransporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.username,
    pass: mailConfig.password
  }
})

module.exports = {
  send (data) {
    data.from = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`
    if (process.env.NODE_ENV !== 'production') {
      // nodemailer app
      devTransporter.sendMail(data, (err, info) => {
        if (err) {
          console.log('Error occurred. ' + err.message)
          return new Error(err)
        }

        console.log('Message sent: %s', info.messageId)
      })
    } else {
      // rotate email provider to send email
      viaMailgun(data)
    }
  }
}

function viaMailgun (data) {
  mailgun.messages().send(data, function (error, body) {
    if (error) {
      return new Error()
    }
  })
}

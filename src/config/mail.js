require('dotenv').config()

module.exports.mailConfig = {
  host: process.env.MAIL_HOST || 'localhost',
  port: process.env.MAIL_PORT || '1025',
  secure: process.env.MAIL_SECURE || false,
  username: process.env.MAIL_USERNAME || 'project.1',
  password: process.env.MAIL_PASSWORD || 'secret.1'
}

module.exports.mailgunConfig = {
  host: process.env.MAILGUN_HOST,
  port: process.env.MAILGUN_PORT,
  secure: process.env.MAILGUN_SECURE,
  apikey: process.env.MAILGUN_APIKEY,
  username: process.env.MAILGUN_USERNAME,
  password: process.env.MAILGUN_PASSWORD
}

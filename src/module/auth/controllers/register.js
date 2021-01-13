const databaseConnection = require('../../../database/connection')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const authConfig = require('../../../config/auth')
const mailer = require('../../../util/mailer')

module.exports = async (req, res, next) => {
  try {
    const collection = databaseConnection.getDatabase().collection('users')
    // create new user
    const hashPassword = await bcrypt.hash(req.body.password, 10)
    const emailVerficicationCode = crypto.randomBytes(20).toString('hex')
    const result = await collection.insertOne({
      fname: req.body.fname,
      lname: req.body.lname,
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      // system generated value
      emailVerificationCode: emailVerficicationCode,
      created_at: new Date()
    })

    // sign new token
    const token = JWT.sign(({
      iss: 'ssu',
      sub: result.ops[0]._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 30)
    }), authConfig.secret)

    // append token into result
    result.ops[0].token = token

    const message = {
      to: req.body.email,
      subject: 'SSU Registration ',
      html: 'Welcome, ...'
    }

    mailer.send(message)

    res.status(201).json({
      created: result.ops[0]
    })
  } catch (error) {
    next(error)
  }
}

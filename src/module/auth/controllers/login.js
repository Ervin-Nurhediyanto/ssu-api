const databaseConnection = require('../../../database/connection')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const result = await databaseConnection.getDatabase()
      .collection('users')
      .find({
        username
      })
      .toArray()

    const user = result[0]
    const hash = user.password

    bcrypt.compare(password, hash).then((resCompare) => {
      if (!resCompare) {
        res.status(401).json({
          error: {
            code: 401,
            message: 'Unauthenticated'
          }
        })
      }
    })

    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email
    }

    jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn: '3h' }, (_err, token) => {
      user.access_token = token
      delete user.password

      res.status(200).json({
        data: user
      })
    })
  } catch (error) {
    next(error)
  }
}

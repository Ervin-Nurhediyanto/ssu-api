const databaseConnection = require('../../../database/connection')
const bcrypt = require('bcrypt')

module.exports = async (req, res, next) => {
  try {
    const collection = databaseConnection.getDatabase().collection('users')
    const hashPassword = await bcrypt.hash(req.body.password, 10)

    const result = await collection.insertOne({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashPassword
    })
    res.status(201).json({
      created: result.ops[0]
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const users = databaseConnection.getDatabase().collection('users')
    const result = await users.findOneAndDelete({
      _id: ObjectID(id)
    })
    res.status(200).json({
      deleted: result.value
    })
  } catch (error) {
    next(error)
  }
}

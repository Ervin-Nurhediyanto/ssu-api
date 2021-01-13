const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const locations = databaseConnection.getDatabase().collection('locations')
    const result = await locations.findOneAndDelete({
      _id: ObjectID(id)
    })
    res.status(200).json({
      deleted: result.value
    })
  } catch (error) {
    next(error)
  }
}

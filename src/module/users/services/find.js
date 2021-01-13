const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async function (id, query) {
  try {
    const result = await databaseConnection.getDatabase().collection('users')
      .find({ _id: ObjectID(id) })
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}

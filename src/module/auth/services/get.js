const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async function (query) {
  try {
    // allowed fields to select
    const allowedFields = ['username', 'email', 'password']

    const result = await databaseConnection.getDatabase().collection('users')
      .find()
      .filter(qsp.filter(query.filter))
      .skip(qsp.skip(query.skip))
      .limit(qsp.limit(query.limit))
      .sort(qsp.sort(query.sort))
      .project(qsp.fields(query.fields, allowedFields))
      .toArray()

    return result
  } catch (error) {
    return new Error(error)
  }
}

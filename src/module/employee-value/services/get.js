const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async function (query) {
  try {
    const result = await databaseConnection.getDatabase().collection('employees-value')
      .find()
      .filter(qsp.filter(query.filter))
      .skip(qsp.skip(query.skip))
      .limit(qsp.limit(query.limit))
      .sort(qsp.sort(query.sort))
      .project(qsp.fields(query.fields))
      .toArray()

    return result
  } catch (error) {
    return new Error(error)
  }
}

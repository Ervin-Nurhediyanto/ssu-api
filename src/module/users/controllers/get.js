const User = require('../services')
const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async (req, res, next) => {
  try {
    const resultAll = await databaseConnection.getDatabase().collection('users')
      .find()
      .filter(qsp.filter(req.query.filter))
      .toArray()

    const result = await User.get(req.query)

    res.status(200).json({
      totalData: resultAll.length,
      currentPage: (req.query.skip / req.query.limit) + 1 || 1,
      lastPage: Math.ceil(resultAll.length / ((req.query.skip / req.query.limit) + 1)) || 1,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

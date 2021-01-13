const locations = require('../services')
const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async (req, res, next) => {
  try {
    const all = await databaseConnection.getDatabase().collection('locations')
      .find()
      .filter(qsp.filter(req.query.filter))
      .toArray()

    const result = await locations.get(req.query)

    res.status(200).json({
      links: {
        totalData: all.length,
        currentPage: (req.query.skip / req.query.limit) + 1 || 1,
        lastPage: Math.ceil(all.length / Number(req.query.limit)) || 1
      },
      data: result
    })
  } catch (error) {
    next(error)
  }
}

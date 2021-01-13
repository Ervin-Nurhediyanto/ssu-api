const Project = require('../services')
const databaseConnection = require('../../../database/connection')
const qsp = require('../../../util/queryStringParse')

module.exports = async (req, res, next) => {
  try {
    const { filter, skip, limit } = req.query
    const page = (skip / limit) + 1
    const all = await databaseConnection.getDatabase().collection('projects')
      .find()
      .filter(qsp.filter(filter))
      .toArray()

    const result = await Project.get(req.query)

    res.status(200).json({
      links: {
        totalData: all.length,
        currentPage: page || 1,
        lastPage: Math.ceil(all.length / Number(req.query.limit)) || 1
      },
      data: result
    })
  } catch (error) {
    next(error)
  }
}

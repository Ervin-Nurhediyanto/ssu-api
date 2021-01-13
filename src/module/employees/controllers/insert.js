const databaseConnection = require('../../../database/connection')
const jwt = require('jsonwebtoken')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    let userId
    let token = req.headers.authorization
    token = token.split(' ')[1]
    jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
      if (!err) {
        userId = decoded._id
      }
    })

    const location = databaseConnection.getDatabase().collection('locations')
    const employee = databaseConnection.getDatabase().collection('employees')

    const dataLocation = await location
      .find({ _id: ObjectID(req.body.idLocation) })
      .toArray()

    const { name, idProject, idLocation } = req.body
    if (name && idProject && idLocation) {
      const result = await employee.insertOne({
        idProject: req.body.idProject,
        idLocation: req.body.idLocation,
        name: req.body.name,
        location: dataLocation[0].location.toUpperCase(),
        total: 0,
        salary: 0,
        createdBy: userId,
        createdAt: new Date()
      })
      res.status(201).json({
        created: result.ops[0]
      })
    } else {
      res.status(403).json({
        error: {
          code: 403,
          message: 'Cannot be empty',
          property: 'name, idProject, idLocation'
        }
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

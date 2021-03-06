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

    const employee = databaseConnection.getDatabase().collection('employees')
    const project = databaseConnection.getDatabase().collection('projects')
    const collection = databaseConnection.getDatabase().collection('employees-value')

    const dataEmployee = await employee
      .find({ _id: ObjectID(req.body.idEmployee) })
      .toArray()

    const dataProject = await project
      .find({ _id: ObjectID(dataEmployee[0].idProject) })
      .toArray()

    const dataFactors = []
    dataProject[0].jobValue.map((group) => {
      const groups = []
      group.factors.map((criteria) => {
        const levels = []
        criteria.level.map((level) => {
          levels.push(level)
        })
        groups.push({
          name: criteria.name,
          score: 0,
          level: levels
        })
      })
      dataFactors.push({
        group: group.group,
        score: 0,
        factors: groups
      })
    })

    const result = await collection.insertOne({
      idEmployee: req.body.idEmployee,
      idLocation: dataEmployee[0].idLocation,
      idProject: dataEmployee[0].idProject,
      nameEmployee: dataEmployee[0].name,
      periodeFrom: null,
      periodeTo: null,
      nameCreator: null,
      total: 0,
      salary: 0,
      salaryAccess: Boolean(req.body.salaryAccess === 'true'),
      jobValue: dataFactors,
      status: 'on-progress',
      createdBy: userId,
      createdAt: new Date()
    })

    res.status(201).json({
      created: result.ops[0]
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const databaseConnection = require('../../../database/connection')
const jwt = require('jsonwebtoken')

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

    const project = databaseConnection.getDatabase().collection('projects')
    const check = await project.findOne({
      name: req.body.name,
      createdBy: userId
    })

    if (check) {
      res.status(403).json({
        code: 403,
        message: 'Already exists',
        property: 'name'
      })
    } else {
      const result = await project.insertOne({
        name: req.body.name,
        jobValue: [],
        createdBy: userId,
        createdAt: new Date()
      })
      res.status(201).json({
        created: result.ops[0]
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

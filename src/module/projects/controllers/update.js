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

    const id = req.params.id
    const project = databaseConnection.getDatabase().collection('projects')
    const check = await project.findOne({
      name: req.body.name,
      created_by: userId
    })

    if (check) {
      res.status(403).json({
        code: 403,
        message: 'Already exists',
        property: 'name'
      })
    } else {
      const result = await project.findOneAndUpdate({
        _id: ObjectID(id)
      }, {
        $set: {
          name: req.body.name
        }
      }, {
        returnOriginal: false
      })
      res.status(200).json({
        updated: result.value
      })
    }
  } catch (error) {
    next(error)
  }
}

// const databaseConnection = require('../../../../database/connection')
// const { ObjectID } = require('mongodb')

// module.exports = async (req, res, next) => {
//   try {
//     const collection = databaseConnection.getDatabase().collection('projects')

//     const result = await collection
//       .find({ _id: ObjectID(req.params.id) })
//       .toArray()

//     res.status(200).json({
//       data: result
//     })
//   } catch (error) {
//     next(error)
//   }
// }

const EmployeeValue = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await EmployeeValue.find(req.params.id)

    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

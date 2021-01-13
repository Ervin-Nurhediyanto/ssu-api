const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const EmployeeValue = databaseConnection.getDatabase().collection('employees-value')
    const check = await EmployeeValue.findOne({
      _id: ObjectID(id)
    })

    if (check) {
      const result = await EmployeeValue.findOneAndDelete({
        _id: ObjectID(id)
      })
      res.status(200).json({
        deleted: result.value
      })
    } else {
      res.status(404).json({
        code: 404,
        message: 'Not Found'
      })
    }
  } catch (error) {
    next(error)
  }
}

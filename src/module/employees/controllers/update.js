const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const location = databaseConnection.getDatabase().collection('locations')
    const employee = databaseConnection.getDatabase().collection('employees')

    const dataEmployee = await employee
      .find({ _id: ObjectID(id) })
      .toArray()

    const oldEmployee = dataEmployee[0]

    let dataLocation
    if (req.body.idLocation) {
      dataLocation = await location
        .find({ _id: ObjectID(req.body.idLocation) })
        .toArray()
    } else {
      dataLocation = [{
        location: oldEmployee.location
      }]
    }

    const result = await employee.findOneAndUpdate({
      _id: ObjectID(id)
    }, {
      $set: {
        idLocation: req.body.idLocation || oldEmployee.idLocation,
        name: req.body.name || oldEmployee.name,
        location: dataLocation[0].location.toUpperCase()
      }
    }, {
      returnOriginal: false
    })

    res.status(200).json({
      updated: result.value
    })
  } catch (error) {
    next(error)
  }
}

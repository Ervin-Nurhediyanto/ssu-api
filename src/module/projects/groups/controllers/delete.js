const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const group = req.body.group
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(id) })
      .toArray()

    const groups = dataProject[0].jobValue

    console.log(groups)
    console.log(group)
    console.log(id)

    const check = []
    groups.map((groupCheck) => {
      if (groupCheck.group === group) {
        check.push(groupCheck)
      }
    })

    console.log(check)

    if (check.length > 0) {
      const index = groups.findIndex(i => i.group === group)

      groups.splice(index, 1)

      const result = await project.findOneAndUpdate({
        _id: ObjectID(id)
      }, {
        $set: {
          jobValue: groups
        }
      }, {
        returnOriginal: false
      })
      res.status(200).json({
        code: 200,
        message: 'deleted successfully'
      })
    } else {
      res.status(404).json({
        code: 404,
        message: 'Not Found',
        property: 'group'
      })
    }
  } catch (error) {
    next(error)
  }
}

const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const name = req.body.oldGroup
    const newName = req.body.group
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(id) })
      .toArray()

    const groups = dataProject[0].jobValue

    const check = []
    const available = []
    groups.map((group) => {
      if (group.group.toUpperCase() === newName.toUpperCase()) {
        check.push(group)
      }
      if (group.group.toUpperCase() === name.toUpperCase()) {
        available.push(group)
      }
    })

    if (available.length < 1) {
      res.status(403).json({
        code: 404,
        message: 'Not Found',
        property: 'group'
      })
    }

    if (check.length < 1) {
      const index = groups.findIndex(i => i.group.toUpperCase() === name.toUpperCase())

      // eslint-disable-next-line security/detect-object-injection
      groups[index].group = newName

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
        // eslint-disable-next-line security/detect-object-injection
        updated: result.value.jobValue[index]
      })
    } else {
      res.status(403).json({
        code: 403,
        message: 'Already exists',
        property: 'group'
      })
    }
  } catch (error) {
    next(error)
  }
}

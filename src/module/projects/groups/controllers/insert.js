const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const name = req.body.group
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(req.body.idProject) })
      .toArray()

    const groups = dataProject[0].jobValue

    const check = []
    groups.map((group) => {
      if (group.group === name) {
        check.push(group)
      }
    })

    if (check.length < 1) {
      groups.push({
        group: name,
        factors: []
      })

      const result = await project.findOneAndUpdate({
        _id: ObjectID(req.body.idProject)
      }, {
        $set: {
          jobValue: groups
        }
      }, {
        returnOriginal: false
      })

      const index = groups.findIndex(i => i.group === name)

      res.status(201).json({
        // eslint-disable-next-line security/detect-object-injection
        created: result.value.jobValue[index]
      })
    } else {
      res.status(403).json({
        code: 403,
        message: 'Already exists',
        property: 'group'
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

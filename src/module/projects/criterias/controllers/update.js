const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const { group, name, oldName } = req.body
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(id) })
      .toArray()

    const groups = dataProject[0].jobValue
    const index = groups.findIndex(i => i.group.toUpperCase() === group.toUpperCase())

    // eslint-disable-next-line security/detect-object-injection
    const criterias = groups[index].factors

    const check = []
    const available = []
    criterias.map((criteria) => {
      if (criteria.name.toUpperCase() === name.toUpperCase()) {
        check.push(criteria)
      }
      if (criteria.name.toUpperCase() === oldName.toUpperCase()) {
        available.push(criteria)
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
      // eslint-disable-next-line security/detect-object-injection
      const criteriaIndex = groups[index].factors.findIndex(i => i.name.toUpperCase() === oldName.toUpperCase())

      // eslint-disable-next-line security/detect-object-injection
      criterias[criteriaIndex].name = name

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
        updated: result.value.jobValue[index].factors[criteriaIndex]
      })
    } else {
      res.status(403).json({
        code: 403,
        message: 'Already exists',
        property: 'Criteria'
      })
    }
  } catch (error) {
    next(error)
  }
}

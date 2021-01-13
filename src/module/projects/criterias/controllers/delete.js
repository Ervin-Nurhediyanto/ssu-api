const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const { group, name } = req.body
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(id) })
      .toArray()

    const groups = dataProject[0].jobValue
    const index = groups.findIndex(i => i.group.toUpperCase() === group.toUpperCase())

    if (index < 0) {
      res.status(404).json({
        code: 404,
        message: 'Not Found',
        property: 'group'
      })
    }

    // eslint-disable-next-line security/detect-object-injection
    const criterias = groups[index].factors

    const check = []
    criterias.map((criteria) => {
      if (criteria.name.toUpperCase() === name.toUpperCase()) {
        check.push(criteria)
      }
    })

    if (check.length > 0) {
      // eslint-disable-next-line security/detect-object-injection
      const criteriaIndex = groups[index].factors.findIndex(i => i.name.toUpperCase() === name.toUpperCase())

      criterias.splice(criteriaIndex, 1)

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
        property: 'Criteria'
      })
    }
  } catch (error) {
    next(error)
  }
}

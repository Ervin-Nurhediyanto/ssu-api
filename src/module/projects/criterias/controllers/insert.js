const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const { idProject, group, name } = req.body
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(idProject) })
      .toArray()

    const groups = dataProject[0].jobValue
    const index = groups.findIndex(i => i.group.toUpperCase() === group.toUpperCase())

    const criterias = groups[index].factors

    const check = []
    criterias.map((criteria) => {
      if (criteria.name.toUpperCase() === name.toUpperCase()) {
        check.push(criteria)
      }
    })

    if (check.length < 1) {
      criterias.push({
        name,
        level: []
      })

      const result = await project.findOneAndUpdate({
        _id: ObjectID(idProject)
      }, {
        $set: {
          jobValue: groups
        }
      }, {
        returnOriginal: false
      })

      const criteriaIndex = groups[index].factors.findIndex(i => i.name.toUpperCase() === name.toUpperCase())

      res.status(201).json({
        created: result.value.jobValue[index].factors[criteriaIndex]
      })
    } else {
      res.status(403).json({
        code: 403,
        message: 'Already exists',
        property: 'Criteria'
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

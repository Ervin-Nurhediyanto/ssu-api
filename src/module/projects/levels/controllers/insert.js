const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const { idProject, group, name, level, description, score } = req.body
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(idProject) })
      .toArray()

    const groups = dataProject[0].jobValue
    const index = groups.findIndex(i => i.group.toUpperCase() === group.toUpperCase())

    const criterias = groups[index].factors
    const criteriaIndex = criterias.findIndex(i => i.name.toUpperCase() === name.toUpperCase())

    const levels = criterias[criteriaIndex].level

    const check = []
    levels.map((lv) => {
      if (Number(lv.level) === Number(level)) {
        check.push(lv)
      }
    })

    if (check.length < 1) {
      const levelScore = Number(score).toFixed(2)
      levels.push({
        level: Number(level),
        description,
        score: Number(levelScore)
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

      const lvIndex = levels.findIndex(i => Number(i.level) === Number(level))

      res.status(201).json({
        created: result.value.jobValue[index].factors[criteriaIndex].level[lvIndex]
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

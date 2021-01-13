const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const { group, name, level, description, score, oldLevel } = req.body
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(id) })
      .toArray()

    const groups = dataProject[0].jobValue
    const index = groups.findIndex(i => i.group.toUpperCase() === group.toUpperCase())

    const criterias = groups[index].factors
    const criteriaIndex = criterias.findIndex(i => i.name.toUpperCase() === name.toUpperCase())

    const levels = criterias[criteriaIndex].level

    const check = []
    const available = []
    levels.map((lv) => {
      if (Number(lv.level) === Number(level)) {
        check.push(lv)
      }
      if (Number(lv.level) === Number(oldLevel)) {
        available.push(lv)
      }
    })

    if (available.length < 1) {
      res.status(403).json({
        code: 404,
        message: 'Not Found',
        property: 'level'
      })
    }

    if (check.length < 1 || level === oldLevel) {
      const levelIndex = levels.findIndex(i => Number(i.level) === Number(oldLevel))

      const levelScore = Number(score).toFixed(2)
      if (level) {
        levels[levelIndex] = {
          level: Number(level),
          description: description || levels.description,
          score: Number(levelScore) || levels.score
        }
      } else {
        levels[levelIndex] = {
          level: Number(oldLevel),
          description: description || levels.description,
          score: Number(levelScore) || levels.score
        }
      }

      const result = await project.findOneAndUpdate({
        _id: ObjectID(id)
      }, {
        $set: {
          jobValue: groups
        }
      }, {
        returnOriginal: false
      })

      let lvIndex
      if (level) {
        lvIndex = levels.findIndex(i => Number(i.level) === Number(level))
      } else {
        lvIndex = levels.findIndex(i => Number(i.level) === Number(oldLevel))
      }

      res.status(200).json({
        updated: result.value.jobValue[index].factors[criteriaIndex].level[lvIndex]
      })
    } else {
      res.status(403).json({
        code: 403,
        message: 'Already exists',
        property: 'level'
      })
    }
  } catch (error) {
    next(error)
  }
}

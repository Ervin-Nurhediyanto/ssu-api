const databaseConnection = require('../../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const { group, name, level } = req.body
    const project = databaseConnection.getDatabase().collection('projects')

    const dataProject = await project
      .find({ _id: ObjectID(id) })
      .toArray()

    const groups = dataProject[0].jobValue
    const index = groups.findIndex(i => i.group.toUpperCase() === group.toUpperCase())

    const criterias = groups[index].factors
    const criteriaIndex = criterias.findIndex(i => i.name.toUpperCase() === name.toUpperCase())

    const levels = criterias[criteriaIndex].level
    const lvIndex = levels.findIndex(i => Number(i.level) === Number(level))

    if (lvIndex < 0) {
      res.status(404).json({
        code: 404,
        message: 'Not Found',
        property: 'level'
      })
    } else {
      levels.splice(lvIndex, 1)
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
    }

    // if (check.length > 0) {
    //   const result = await project.findOneAndUpdate({
    //     _id: ObjectID(id)
    //   }, {
    //     $set: {
    //       jobValue: groups
    //     }
    //   }, {
    //     returnOriginal: false
    //   })
    //   res.status(200).json({
    //     code: 200,
    //     message: 'deleted successfully'
    //   })
    // } else {
    //   res.status(404).json({
    //     code: 404,
    //     message: 'Not Found',
    //     property: 'Criteria'
    //   })
    // }
  } catch (error) {
    next(error)
  }
}

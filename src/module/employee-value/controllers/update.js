const databaseConnection = require('../../../database/connection')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    const id = req.params.id
    const { group, name, score, periodeFrom, periodeTo, nameCreator, status } = req.body

    const EmployeeValue = databaseConnection.getDatabase().collection('employees-value')
    const Employee = databaseConnection.getDatabase().collection('employees')
    const location = databaseConnection.getDatabase().collection('locations')

    const dataEmployeeValue = await EmployeeValue
      .find({ _id: ObjectID(id) })
      .toArray()

    const dataLocation = await location
      .find({ _id: ObjectID(dataEmployeeValue[0].idLocation) })
      .toArray()

    let scoreGroup = 0
    let totalScore = 0
    let salary = dataEmployeeValue[0].salary

    if (!status) {
      console.log('status: on-progress')
      const groups = dataEmployeeValue[0].jobValue
      const index = groups.findIndex(i => i.group.toUpperCase() === group.toUpperCase())

      const criterias = groups[index].factors
      const indexCriteria = criterias.findIndex(i => i.name.toUpperCase() === name.toUpperCase())

      if (score) {
        criterias[indexCriteria].score = Number(score)
        criterias.map((criteria) => {
          scoreGroup += criteria.score
        })

        scoreGroup = Number(scoreGroup.toFixed(2))

        groups[index].score = scoreGroup
        groups.map((group) => {
          totalScore += group.score
        })

        totalScore = Number(totalScore.toFixed(2))
        salary = Number((totalScore * dataLocation[0].unitValue).toFixed(2))

        // Rp.
        let rupiah = ''
        const salaryRp = salary.toString().split('.')
        const angkarev = salaryRp[0].toString().split('').reverse().join('')
        for (let i = 0; i < angkarev.length; i++) {
          if (i % 3 === 0) {
            rupiah += angkarev.substr(i, 3) + '.'
          }
        }
        if (salaryRp[1]) {
          rupiah = rupiah.split('', rupiah.length - 1).reverse().join('') + '.' + salaryRp[1]
        } else {
          rupiah = rupiah.split('', rupiah.length - 1).reverse().join('') + '.' + '00'
        }
        //

        salary = rupiah
      }

      const result = await EmployeeValue.findOneAndUpdate({
        _id: ObjectID(id)
      }, {
        $set: {
          periodeFrom,
          periodeTo,
          nameCreator,
          total: totalScore,
          salary,
          jobValue: groups
        }
      }, {
        returnOriginal: false
      })
      res.status(200).json({
        updated: result.value
      })
    } else {
      console.log('status: ' + status)

      const result = await EmployeeValue.findOneAndUpdate({
        _id: ObjectID(id)
      }, {
        $set: {
          status,
          nameCreator,
          periodeFrom,
          periodeTo
        }
      }, {
        returnOriginal: false
      })

      // console.log(result)

      Employee.findOneAndUpdate({
        _id: ObjectID(dataEmployeeValue[0].idEmployee)
        // _id: ObjectID(result.value.updated.idEmployee)
      }, {
        $set: {
          total: totalScore,
          salary
        }
      }, {
        returnOriginal: false
      })

      // console.log(updateEmployee)

      res.status(200).json({
        updated: result.value
      })
    }
  } catch (error) {
    next(error)
  }
}

const databaseConnection = require('../../../database/connection')
const jwt = require('jsonwebtoken')
const { ObjectID } = require('mongodb')

module.exports = async (req, res, next) => {
  try {
    let userId
    let token = req.headers.authorization
    token = token.split(' ')[1]
    jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
      if (!err) {
        userId = decoded._id
      }
    })

    const id = req.params.id
    const locations = databaseConnection.getDatabase().collection('locations')
    const checkDuplicate = await locations
      .find({ location: req.body.location.toUpperCase(), created_by: userId })
      .toArray()

    if (checkDuplicate.length > 0) {
      res.status(403).json({
        message: 'the location already exists'
      })
    } else {
      let wage = Number(Number(req.body.minimumWage).toFixed(2))
      // Rp.
      let rupiah = ''
      const wageRp = wage.toString().split('.')
      const angkarev = wageRp[0].toString().split('').reverse().join('')
      for (let i = 0; i < angkarev.length; i++) {
        if (i % 3 === 0) {
          rupiah += angkarev.substr(i, 3) + '.'
        }
      }
      if (wageRp[1]) {
        rupiah = rupiah.split('', rupiah.length - 1).reverse().join('') + '.' + wageRp[1]
      } else {
        rupiah = rupiah.split('', rupiah.length - 1).reverse().join('') + '.' + '00'
      }
      //

      wage = rupiah

      const result = await locations.findOneAndUpdate({
        _id: ObjectID(id)
      }, {
        $set: {
          location: req.body.location.toUpperCase(),
          minimumWage: wage,
          jobValue: Number(req.body.jobValue),
          unitValue: Number((Number(req.body.minimumWage) / Number(req.body.jobValue)).toFixed(2))
        }
      }, {
        returnOriginal: false
      })
      res.status(200).json({
        updated: result.value
      })
    }
  } catch (error) {
    next(error)
  }
}

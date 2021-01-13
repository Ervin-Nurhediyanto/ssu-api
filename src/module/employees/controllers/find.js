const Employee = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await Employee.find(req.params.id)

    if (result.length < 1) {
      res.status(404).json({
        code: 404,
        message: 'Not Found'
      })
    } else {
      res.status(200).json({
        data: result[0]
      })
    }
  } catch (error) {
    next(error)
  }
}

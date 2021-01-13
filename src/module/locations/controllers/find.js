const EmployeeValue = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await EmployeeValue.find(req.params.id)

    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

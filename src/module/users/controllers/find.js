const User = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await User.find(req.params.id)

    res.status(200).json({
      data: result[0]
    })
  } catch (error) {
    next(error)
  }
}

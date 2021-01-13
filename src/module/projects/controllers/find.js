const Project = require('../services')

module.exports = async (req, res, next) => {
  try {
    const result = await Project.find(req.params.id)

    res.status(200).json({
      data: result
    })
  } catch (error) {
    next(error)
  }
}

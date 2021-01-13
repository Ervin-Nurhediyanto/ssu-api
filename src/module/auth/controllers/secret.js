module.exports = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'token accepted'
    })
  } catch (error) {
    next(error)
  }
}

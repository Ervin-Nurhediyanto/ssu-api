const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    let token = req.headers.authorization
    token = token.split(' ')[1]
    jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
      if (err) {
        res.status(401).json({
          error: {
            code: 401,
            message: 'Unauthenticated'
          }
        })
      } else {
        next()
      }
    })
  } catch (error) {
    next(error)
  }
}

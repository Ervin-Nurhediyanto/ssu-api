require('dotenv').config()

const auth = {
  secret: process.env.AUTH_SECRET
}

module.exports = auth

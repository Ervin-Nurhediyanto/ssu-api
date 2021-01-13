require('dotenv').config()

const database = {
  host: process.env.DB_HOST || 'localhost:27017',
  name: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
}

module.exports = database

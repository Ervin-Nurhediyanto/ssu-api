const express = require('express')
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const xssClean = require('xss-clean')
// const cors = require('./middleware/cors.middleware')
const cors = require('cors')
const compression = require('compression')
const mongoSanitize = require('express-mongo-sanitize')
const databaseConnection = require('./database/connection')
const datalize = require('datalize')

// gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app
app.use(compression())

// run database if not in test environment
if (process.env.NODE_ENV !== 'test') {
  databaseConnection.connect().catch(error => {
    console.log(error)
  })
}

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
  // Application specific logging, throwing an error, or other logic here
})

// logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }))

// add global error handling for validation
datalize.set('autoValidate', true)

// set security HTTP headers
app.use(helmet())

// make sure this comes before any routes
app.use(xssClean())

// sanitize mongodb security
app.use(mongoSanitize())

// cors
app.use(cors())

// v1 api routes
app.use('/v1', require('./router'))

module.exports = app

const { createLogger, format, transports } = require('winston')
const loggerConfig = require('../config/logger')
const { combine, timestamp, prettyPrint, colorize, errors } = format

const logger = createLogger({
  exitOnError: false,
  format: combine(
    errors({ stack: true }),
    colorize(),
    timestamp(),
    prettyPrint()
  ),
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    new transports.File(loggerConfig.error),
    new transports.File(loggerConfig.combined)
  ],
  rejectionHandlers: [
    new transports.File(loggerConfig.rejection)
  ],
  exceptionHandlers: [
    new transports.File(loggerConfig.exception)
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console())
}

module.exports = logger

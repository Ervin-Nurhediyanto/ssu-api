module.exports = {
  error: {
    filename: 'logs/error.log',
    level: 'error',
    handleExceptions: true,
    json: true
  },
  combined: { filename: 'logs/combined.log' },
  rejection: { filename: 'logs/rejections.log' },
  exception: { filename: 'logs/exceptions.log' }
}

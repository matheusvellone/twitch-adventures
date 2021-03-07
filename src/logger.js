const log4js = require('log4js')
const { debug } = require('./config')

module.exports = (context) => {
  const logger = log4js.getLogger(context)

  logger.level = debug ? 'debug' : 'error'

  return logger
}

const { prop } = require('ramda')
const Promise = require('bluebird')

const screenshot = require('./screenshot')
const logger = require('../logger')('MODULES')

const modules = [
  screenshot,
]

module.exports.run = (params) => (...args) => {
  const runModule = (module) => module.run(params, args)
    .catch((error) => {
      logger.fatal(`Error on module ${module}`, error)
    })

  modules
    .filter(prop('active'))
    .forEach(runModule)
}

module.exports.validate = (params) => {
  const validateModule = async (module) => {
    if (!module.validate) {
      return
    }

    try {
      await module.validate(params)
    } catch (error) {
      logger.fatal(`Error on validating module ${module}`, error)

      module.active = false
    }
  }

  return Promise
    .filter(modules, prop('active'))
    .filter(validateModule)
}

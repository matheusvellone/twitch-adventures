const screenshot = require('./screenshot')

const modules = [
  screenshot,
]

module.exports = (params) => (...args) => {
  modules.forEach((module) => {
    return module(params, args)
      .catch((error) => {
        console.log({
          message: 'Error on module',
          module,
          error
        })
      })
  })
}

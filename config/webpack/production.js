process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.ROLLBAR_CLIENT_KEY = process.env.ROLLBAR_CLIENT_KEY || ''

const environment = require('./environment')

module.exports = environment.toWebpackConfig()

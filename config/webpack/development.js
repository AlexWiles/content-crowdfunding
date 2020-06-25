process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.ROLLBAR_CLIENT_KEY = process.env.ROLLBAR_CLIENT_KEY || ''
process.env.CLOUDFRONT_ENDPOINT = process.env.CLOUDFRONT_ENDPOINT || false

const environment = require('./environment')

module.exports = environment.toWebpackConfig()

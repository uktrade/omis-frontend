const config = require('../../../config')
const logger = require('../lib/logger')

let webpackManifest = {}
try {
  webpackManifest = require(`${config.buildDir}/manifest.json`)
} catch (err) {
  logger.error('Manifest file is not found. Ensure assets are built.', {
    eventType: logger.eventTypes.expressStartup,
  })
}

module.exports = function setLocals(req, res, next) {
  const baseUrl = `${req.encrypted ? 'https' : req.protocol}://${req.get('host')}`

  res.locals = Object.assign({}, res.locals, {
    BASE_URL: baseUrl,
    CANONICAL_URL: baseUrl + req.path,
    CURRENT_PATH: req.path,
    GOOGLE_TAG_MANAGER_KEY: config.googleTagManagerKey,
    GOOGLE_TAG_MANAGER_SUFFIX: config.googleTagManagerSuffix,

    getMessages() {
      return req.flash()
    },

    getPageTitle() {
      return ''
    },

    getAssetPath(asset) {
      const assetsUrl = config.assetsHost || baseUrl
      const webpackAssetPath = webpackManifest[asset]

      if (webpackAssetPath) {
        return `${assetsUrl}/${webpackAssetPath}`
      }

      return `${assetsUrl}/${asset}`
    },
  })
  next()
}

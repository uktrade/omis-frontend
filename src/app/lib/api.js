const request = require('request-promise-native')
const { assign, isString } = require('lodash')

const { api } = require('../../../config')
const logger = require('../lib/logger')

function fetchAuthToken () {
  const options = {
    method: 'POST',
    json: true,
    url: api.root + api.authUrl,
    form: {
      grant_type: 'client_credentials',
      client_id: api.clientId,
      client_secret: api.clientSecret,
      scope: api.clientScope,
    },
  }

  return request(options)
};

function setAuthToken () {
  return async function (req, res, next) {
    if (req.session.token) {
      return next()
    }

    try {
      const response = await fetchAuthToken()

      req.session.token = response.access_token
      next()
    } catch (error) {
      logger.error(error)
      next()
    }
  }
};

function fetch (token, options) {
  const settings = {
    baseUrl: api.root,
    headers: {},
    json: true,
  }

  if (isString(options)) {
    settings.url = options
  } else {
    assign(settings, options)
  }

  if (token) {
    settings.headers.Authorization = `Bearer ${token}`
  }

  return request(settings)
}

module.exports = {
  fetch,
  setAuthToken,
}

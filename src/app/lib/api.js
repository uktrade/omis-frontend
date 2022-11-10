const { isString } = require('lodash')

const axios = require('axios')
const hawk = require('hawk')

const config = require('../../../config')

function getHawkHeader (credentials, uri, method) {
  // Generate Authorization request header
  // Ensure backend is using same protocol for hash generation
  return hawk.client.header(uri, method, {
    credentials,
    payload: '',
    contentType: 'application/json',
  })
}

function parseOptions (options) {
  if (isString(options)) {
    return {
      url: options,
      method: 'GET',
    }
  }

  return {
    url: options.url,
    method: options.method.toUpperCase(),
  }
}

function buildRequestOptions (method, url, hawkHeader) {
  return {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': hawkHeader.header,
    },
  }
}

async function fetch (options, hawkCredentials = config.api.hawkCredentials) {
  const { url, method } = parseOptions(options)

  const completeURL = `${config.api.root}${url}`

  const request = axios.create({
    baseURL: config.api.root,
    timeout: 3600,
  })
  const hawkHeader = getHawkHeader(hawkCredentials, completeURL, method)

  const requestOptions = buildRequestOptions(method, completeURL, hawkHeader)

  let response
  response = await request(requestOptions)
  // If the response can't be authorised, an exception will be thrown
  hawk.client.authenticate(
    response,
    hawkCredentials,
    hawkHeader.artifacts,
    // Axios returns a JSON object and to authenticate the request
    // we need a string.
    { payload: JSON.stringify(response.data) },
  )

  return response.data
}

module.exports = {
  fetch,
}

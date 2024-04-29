/* eslint-disable no-unused-vars */
const nock = require('nock')
const hawk = require('hawk')

const config = require('../../../../../config')
const { fetch } = require('../../../../app/lib/api')

const testWrongCredentials = {
  id: 'wrong-key-id',
  key: 'oh-no',
  algorithm: 'sha256',
}

const testGetApiURL = '/v3/public/omis/order/123456789/quote'
const testPostApiURL = '/v3/public/omis/order/123456789/quote/accept'
const testForgedApiURL = '/v3/forged'

const forgedServerResponse = `Hawk \
  mac="thisisforgedZhekb9pp85i7lcyKQzTB6tIkPB118Ak=", \
  hash="aDncgAmbN7HhDEVUMGzm/xxDD+ErJJ0Hx7OSMh2RK2Q="`

const mockServerResponse = [
  {
    id: 1,
    name: 'something',
  },
]

async function authenticateHawkRequest(request) {
  const hawkRequest = {
    ...request,
    url: request.path,
    host: request.hostname,
  }
  const { credentials, artifacts } = await hawk.server.authenticate(
    hawkRequest,
    () => config.api.hawkCredentials
  )
  const serverHeader = hawk.server.header(credentials, artifacts, {
    payload: JSON.stringify(mockServerResponse),
    contentType: request.headers['content-type'],
  })
  return serverHeader
}

describe('api fetch', () => {
  describe('GET request', () => {
    beforeEach(() => {
      nock(config.api.root)
        .get(testGetApiURL)
        .reply(async function (uri, requestBody) {
          try {
            const serverHeader = await authenticateHawkRequest(this.req)
            return [
              200,
              mockServerResponse,
              { 'Server-Authorization': serverHeader },
            ]
          } catch (e) {
            return [401, { error: 'Unauthorized' }]
          }
        })
    })

    it('successfuly requests Hawk authenticated endpoint', async function () {
      const response = await fetch(testGetApiURL)
      expect(response).toEqual(mockServerResponse)
    })

    it('fails to request Hawk authenticated endpoint using wrong credentials', async function () {
      let err
      try {
        await fetch(testGetApiURL, testWrongCredentials)
      } catch (e) {
        err = e
      }
      expect(err).toEqual(new Error('Request failed with status code 401'))
    })
  })

  describe('POST request', () => {
    it('successfuly requests Hawk authenticated endpoint using POST method', async function () {
      nock(config.api.root)
        .post(testPostApiURL)
        .reply(async function (uri, requestBody) {
          const serverHeader = await authenticateHawkRequest(this.req)
          return [
            200,
            mockServerResponse,
            { 'Server-Authorization': serverHeader },
          ]
        })

      const response = await fetch({ url: testPostApiURL, method: 'post' })
      expect(response).toEqual(mockServerResponse)
    })
  })

  describe('Forged response', () => {
    it('fails when server response is forged', async function () {
      nock(config.api.root)
        .get(testForgedApiURL)
        .reply(async function (uri, requestBody) {
          return [
            200,
            mockServerResponse,
            { 'Server-Authorization': forgedServerResponse },
          ]
        })
      let err
      try {
        await fetch(testForgedApiURL)
      } catch (e) {
        err = e
      }
      expect(err).toEqual(new Error('Bad response mac'))
    })
  })
})

const axios = require('axios')

const logger = require('../../../../app/lib/logger')
const { renderPingdomXml } = require('../../../../app/controllers/healthcheck')

describe('renderPingdomXml', () => {
  let req, res, next

  beforeEach(() => {
    req = {}
    res = {
      set: jasmine.createSpy('set'),
      send: jasmine.createSpy('send'),
      status: jasmine.createSpy('status').and.callFake(() => res),
    }
    next = jasmine.createSpy('next')

    spyOn(axios, 'get')
    spyOn(logger, 'error')
  })

  it('should return 200 OK when all dependencies are healthy', async () => {
    axios.get.and.resolveTo({ statusText: 'OK' })

    await renderPingdomXml(req, res, next)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(jasmine.stringMatching('OK'))
  })

  it('should return 503 Service Unavailable when a dependency fails', async () => {
    axios.get.and.rejectWith(new Error('Service Unavailable'))

    await renderPingdomXml(req, res, next)

    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.send).toHaveBeenCalledWith(
      jasmine.stringMatching('Service Unavailable')
    )
    expect(logger.error).toHaveBeenCalled()
  })
})

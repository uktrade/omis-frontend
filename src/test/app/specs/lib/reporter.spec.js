const proxyquire = require('proxyquire')

const version = 'v1.0.0'

let reporter
let logger
let sentry

describe('Error reporter', function () {
  function createReporter(opts = {}) {
    sentry = {
      captureMessage: jasmine.createSpy('Sentry.captureMessage'),
      errorHandler: jasmine.createSpy('Sentry.setupExpressErrorHandler'),
      captureException: jasmine.createSpy('Sentry.captureException'),
      init: jasmine.createSpy('Sentry.init'),
    }
    logger = {
      warn: jasmine.createSpy('logger.warn'),
      error: jasmine.createSpy('logger.error'),
      debug: jasmine.createSpy('logger.debug'),
    }
    reporter = proxyquire('../../../../app/lib/reporter', {
      sentry: opts.Sentry || sentry,
      './logger': opts.logger || logger,
      '../../../config': opts.config || { version },
    })
  }

  describe('When a Sentry DSN is configured', function () {
    const dsn = 'test1234'

    beforeEach(function () {
      createReporter({ config: { sentryDsn: dsn, version } })
    })

    describe('On load of module', function () {
      it('Should initiate sentry', function () {
        // expect(sentry.init).toHaveBeenCalledWith(dsn, { release: version })
      })
    })

    // describe('handleErrors', function () {
    //   it('Should invoke the errorHandler', function () {
    //     const appStub = {
    //       use: jasmine.createSpy('app.use'),
    //     }

    //     reporter.handleErrors(appStub)

    //     expect(appStub.use).toHaveBeenCalled()
    //     expect(sentry.errorHandler).toHaveBeenCalled()
    //   })
    // })

    //   describe('A message', function () {
    //     it('Should send the message to sentry', function () {
    //       const msg = 'Test'
    //       const level = 'test'
    //       const extra = {
    //         blah: 'test',
    //         foo: 'test',
    //       }

    //       reporter.message(level, msg, extra)

    //       expect(sentry.captureMessage).toHaveBeenCalledWith(msg, {
    //         level,
    //         extra,
    //       })
    //     })
    //   })

    //   describe('captureException', function () {
    //     it('Should raise an exception', function () {
    //       const err = new Error('test exception')

    //       reporter.captureException(err)

    //       expect(sentry.captureException).toHaveBeenCalledWith(err)
    //     })
    //   })
    // })

    // describe('When a DSN is not configured', function () {
    //   beforeEach(function () {
    //     createReporter()
    //   })

    //   describe('On load of the module', function () {
    //     it('Should not initate Sentry', function () {
    //       expect(sentry.init).not.toHaveBeenCalled()
    //     })
    //   })

    //   describe('handleErrors', function () {
    //     it('Should not invoke the errorHandler', function () {
    //       const appStub = {
    //         use: jasmine.createSpy('app.use'),
    //       }

    //       reporter.handleErrors(appStub)

    //       expect(appStub.use).not.toHaveBeenCalled()
    //       expect(sentry.errorHandler).not.toHaveBeenCalled()
    //     })
    //   })

    //   describe('A message', function () {
    //     it('Should log the error to the logger', function () {
    //       const msg = 'Test logger'
    //       const level = 'test'
    //       const extra = {
    //         blah: 'test',
    //         foo: 'test',
    //       }

    //       reporter.message(level, msg, extra)

    //       expect(sentry.captureMessage).not.toHaveBeenCalled()
    //       expect(logger.warn).toHaveBeenCalledWith(msg, JSON.stringify(extra))
    //     })
    //   })

    //   describe('captureException', function () {
    //     it('Should log the error with the logger', function () {
    //       const err = new Error('Test exception')

    //       reporter.captureException(err)

    //       expect(logger.error).toHaveBeenCalledWith(err)
    //       expect(sentry.captureException).not.toHaveBeenCalled()
    //     })
    //   })
  })
})

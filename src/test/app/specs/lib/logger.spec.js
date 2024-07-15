const proxyquire = require('proxyquire')
const stdMocks = require('std-mocks')
const sinon = require('sinon')

const config = require('../../../../../config/index')

describe('Logger transport check', () => {
  let expectedInfo = {
    EventMessage: 'Message for info',
    EventCount: 1,
    EventType: 'express.startup',
    EventResult: 'NA',
    EventSeverity: 'Informational',
    EventOriginalSeverity: 'info',
    EventSchema: 'ProcessEvent',
    EventSchemaVersion: '0.1.4',
    ActingAppType: 'Express',
    AdditionalFields: { CustomASIMFormatter: true, TraceHeaders: {} },
  }
  let expectedWarning = {
    EventMessage: 'Mind yourself for the warning',
    EventCount: 1,
    EventType: 'express.startup',
    EventResult: 'NA',
    EventSeverity: 'Low',
    EventOriginalSeverity: 'warn',
    EventSchema: 'ProcessEvent',
    EventSchemaVersion: '0.1.4',
    ActingAppType: 'Express',
    AdditionalFields: { CustomASIMFormatter: true, TraceHeaders: {} },
  }
  let expectedError = {
    EventMessage: 'An error occurred',
    EventCount: 1,
    EventType: 'express.request',
    EventResult: 'NA',
    EventSeverity: 'Medium',
    EventOriginalSeverity: 'error',
    EventSchema: 'ProcessEvent',
    EventSchemaVersion: '0.1.4',
    ActingAppType: 'Express',
    AdditionalFields: { CustomASIMFormatter: true, TraceHeaders: {} },
  }
  let expectedLog = {
    EventMessage: 'A logged line',
    EventCount: 1,
    EventType: 'express.request',
    EventResult: 'NA',
    EventSeverity: 'Informational',
    EventOriginalSeverity: 'info',
    EventSchema: 'ProcessEvent',
    EventSchemaVersion: '0.1.4',
    ActingAppType: 'Express',
    AdditionalFields: { CustomASIMFormatter: true, TraceHeaders: {} },
  }

  describe('In production environment', () => {
    beforeEach(() => {
      process.env.LOG_LEVEL = 'info'
      proxyquire.noPreserveCache()
      sinon.stub(config, 'isProd').value(true)
      this.logger = proxyquire('../../../../app/lib/logger', {})
    })

    it('Logger return ASIMFormat for production environment', () => {
      stdMocks.use()
      this.logger.info('Message for info', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      this.logger.warn('Mind yourself for the warning', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      this.logger.error('An error occurred', {
        eventType: this.logger.eventTypes.expressRequest,
      })
      this.logger.log('info', 'A logged line', {
        eventType: this.logger.eventTypes.expressRequest,
      })
      stdMocks.restore()
      const output = stdMocks.flush()
      const entries = output.stdout.map((line) => JSON.parse(line))

      expect(entries).toContain(jasmine.objectContaining(expectedInfo))
      expect(entries).toContain(jasmine.objectContaining(expectedWarning))
      expect(entries).toContain(jasmine.objectContaining(expectedError))
      expect(entries).toContain(jasmine.objectContaining(expectedLog))
      const transports = this.logger.transports
      expect(transports).toBeInstanceOf(Array)
      expect(transports).toHaveSize(2)
    })
  })

  describe('In non production environments', () => {
    beforeEach(() => {
      proxyquire.noPreserveCache()
      sinon.stub(config, 'isProd').value(false)
      this.logger = proxyquire('../../../../app/lib/logger', {})
      this.logger.silent = false
    })
    it('Logger return plain format for non production environment', () => {
      stdMocks.use()
      this.logger.info('Drum roll for info', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      this.logger.warn('It is a warning', {
        eventType: this.logger.eventTypes.expressStartup,
      })
      this.logger.error('Failed roll error', {
        eventType: this.logger.eventTypes.expressRequest,
      })
      stdMocks.restore()
      const output = stdMocks.flush()

      expect(output.stdout).toContain(
        jasmine.stringContaining(
          '{"eventType":"express.startup","level":"info","message":"Drum roll for info"}\n'
        )
      )
      expect(output.stdout).toContain(
        jasmine.stringContaining(
          '{"eventType":"express.startup","level":"warn","message":"It is a warning"}\n'
        )
      )
      expect(output.stdout).toContain(
        jasmine.stringContaining(
          '{"eventType":"express.request","level":"error","message":"Failed roll error"}\n'
        )
      )
    })
  })
})

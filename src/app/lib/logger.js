const winston = require('winston')

const { createLogger, transports, format } = winston

const eventTypes = {
  expressStartup: 'express.startup',
  expressRequest: 'express.request',
}

const asimFormat = format.printf(
  ({ level, message, timestamp, eventType = eventTypes.expressRequest }) => {
    return JSON.stringify({
      EventMessage: message,
      EventCount: 1,
      EventStartTime: timestamp,
      EventEndTime: timestamp,
      EventType: eventType,
      EventResult: 'NA',
      EventSeverity: getEventSeverity(level),
      EventOriginalSeverity: level,
      EventSchema: 'ProcessEvent',
      EventSchemaVersion: '0.1.4',
      ActingAppType: 'Express',
      AdditionalFields: {
        CustomASIMFormatter: true,
        TraceHeaders: {},
      },
    })
  }
)

const getEventSeverity = (level) => {
  return {
    debug: 'Informational',
    info: 'Informational',
    warn: 'Low',
    error: 'Medium',
    critical: 'High',
  }[level]
}

const config = require("../../../config")
const loggerConfiguration = {
  level: config.logLevel,
  transports: [new winston.transports.Console({ colorize: config.isDev })],
}

if (config.isProd) {
  // Only send asim formatted logs on production as other types will mess up processing.
  loggerConfiguration.transports = [
    new transports.Console({
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: true,
      format: format.combine(
        winston.format.splat(),
        format.simple(),
        format.timestamp(),
        asimFormat
      ),
    }),
  ]
}

const logger = createLogger(loggerConfiguration)

if (config.isDev) {
  logger.exceptions.handle(
    new transports.Console({
      format: format.combine(format.timestamp(), format.json()),
    })
  )
}

// Add event types to logger to allow call of constants.
logger.eventTypes = eventTypes

module.exports = logger

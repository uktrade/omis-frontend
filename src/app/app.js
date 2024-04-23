require('dotenv').config()
const cluster = require('cluster')

const config = require('../../config')
const logger = require('./lib/logger')
const createApp = require('./create-app')

const serverConfig = config.server
const numberOfWorkers = serverConfig.workers
const isClustered = numberOfWorkers > 1

function startApp() {
  const app = createApp()
  const env = app.get('env')

  app.listen(serverConfig.port, function () {
    let messages = []

    if (isClustered) {
      messages.push(`Worker ${cluster.worker.id} created`)
    }

    messages.push(
      `App running in ${env} mode, workers: ${config.server.workers}`
    )
    messages.push(
      `Listening at http://${serverConfig.host}:${serverConfig.port}`
    )

    logger.info(messages.join('   '), { eventType: logger.eventTypes.expressStartup,})
  })
}

if (isClustered) {
  // if this is the master then create the workers
  if (cluster.isMaster) {
    logger.info('Runing in cluster mode.', { eventType: logger.eventTypes.expressStartup,})
    for (let i = 0; i < numberOfWorkers; i++) {
      cluster.fork()
    }
    // if we are a worker then create an HTTP server
  } else {
    startApp()
  }
} else {
  logger.info('Not running in cluster mode.', { eventType: logger.eventTypes.expressStartup,})
  startApp()
}

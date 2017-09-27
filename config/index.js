const os = require('os')
const path = require('path')

const cpus = (os.cpus().length || 1)
const defaultWorkers = (cpus > 1 ? cpus - 1 : cpus)

function env (name, defaultValue) {
  return (process.env[ name ] || defaultValue)
}

function bool (name, defaultValue) {
  return (env(name, defaultValue) + '') === 'true'
}

const isProd = env('NODE_ENV') === 'production'
const root = path.normalize(`${__dirname}/..`)

const config = {
  root,
  isProd,
  isDev: !isProd,
  showErrors: !isProd,
  server: {
    host: env('SERVER_HOST', 'localhost'),
    port: env('SERVER_PORT', env('PORT', 3000)),
    workers: env('SERVER_WORKERS', env('WEB_CONCURRENCY', defaultWorkers)),
  },
  views: {
    cache: bool('CACHE_VIEWS', true),
  },
  logLevel: env('LOG_LEVEL', 'warn'),
  api: {
    root: env('API_ROOT', 'http://localhost:8000'),
    authUrl: env('API_AUTH_URL', '/token/'),
    clientId: env('API_CLIENT_ID'),
    clientSecret: env('API_CLIENT_SECRET'),
    clientScope: env('API_CLIENT_SCOPE'),
  },
}

module.exports = config

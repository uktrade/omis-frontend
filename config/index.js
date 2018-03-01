const os = require('os')
const path = require('path')

const cpus = (os.cpus().length || 1)
const defaultWorkers = (cpus > 1 ? cpus - 1 : cpus)

const isProd = process.env.NODE_ENV === 'production'
const root = path.normalize(`${__dirname}/..`)

const config = {
  root,
  isProd,
  isDev: !isProd,
  showErrors: !isProd,
  buildDir: path.join(root, '.build'),
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: process.env.SERVER_PORT || (process.env.PORT || 3000),
    workers: process.env.SERVER_WORKERS || (process.env.WEB_CONCURRENCY || defaultWorkers),
  },
  views: {
    cache: (process.env.CACHE_VIEWS + '') === 'true',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'howdoesyourgardengrow',
    // 2 hour timeout
    ttl: process.env.SESSION_TTL || (2 * 60 * 60 * 1000),
  },
  logLevel: process.env.LOG_LEVEL || 'warn',
  api: {
    root: process.env.API_ROOT || 'http://localhost:8000',
    authUrl: process.env.API_AUTH_URL || '/token/',
    clientId: process.env.API_CLIENT_ID,
    clientSecret: process.env.API_CLIENT_SECRET,
    clientScope: process.env.API_CLIENT_SCOPE,
  },
  formats: {
    currency: '$0,0.00',
    dateLong: 'D MMMM YYYY',
    dateMedium: 'D MMM YYYY',
    dateTimeLong: 'D MMMM YYYY, h:mma',
    dateTimeMedium: 'D MMM YYYY, h:mma',
  },
  sentryDsn: process.env.SENTRY_DSN,
  googleTagManagerKey: process.env.GOOGLE_TAG_MANAGER_KEY,
  googleTagManagerSuffix: process.env.GOOGLE_TAG_MANAGER_SUFFIX,
  showPaymentJourney: process.env.FLAG_SHOW_PAYMENT_JOURNEY || false,
}

module.exports = config

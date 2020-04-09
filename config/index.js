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
    hawkCredentials: {
      id: process.env.API_CLIENT_HAWK_ACCESS_KEY_ID,
      key: process.env.API_CLIENT_HAWK_SECRET_ACCESS_KEY,
      algorithm: 'sha256',
    },
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
}

module.exports = config

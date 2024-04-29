module.exports = function (isDev) {
  const cspValues = [
    `default-src 'none'`,
    `base-uri 'self'`,
    `script-src 'self' 'unsafe-inline' www.google-analytics.com www.googletagmanager.com`,
    `style-src 'self' 'unsafe-inline'`,
    `font-src 'self'`,
    `connect-src 'self' ${isDev ? 'ws:' : ''}`,
    `img-src 'self' www.google-analytics.com`,
    `frame-src www.googletagmanager.com`,
    `form-action 'self'`,
  ].join(';')

  return function (req, res, next) {
    res.setHeader('X-Download-Options', 'noopen')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'deny')
    res.setHeader('Content-Security-Policy', cspValues)
    res.setHeader('Cache-Control', 'no-cache, no-store')

    if (!isDev) {
      res.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains'
      )
    }

    next()
  }
}

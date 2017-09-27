module.exports = function (isDev) {
  const FORCE_HTTPS = (!isDev)

  return function (req, res, next) {
    const header = req.headers[ 'x-forwarded-proto' ]

    if (FORCE_HTTPS && typeof header !== 'undefined' && header !== 'https') {
      res.redirect([ 'https://', req.get('Host'), req.url ].join(''))
    } else {
      next()
    }
  }
}

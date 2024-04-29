module.exports = () => {
  return function setCsrfToken(req, res, next) {
    res.locals.CSRF_TOKEN = req.csrfToken()
    next()
  }
}

module.exports = function (req, res, next) {
  if (req.url === '/ping/') {
    res.status(200)
    res.end()
  } else {
    next()
  }
}

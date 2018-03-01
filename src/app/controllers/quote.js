const { get } = require('lodash')

const { fetch } = require('../lib/api')

function renderQuote (req, res, next) {
  res.render('quote')
};

function renderAcceptedQuote (req, res, next) {
  if (!res.locals.quote.accepted_on) {
    return res.redirect(`/${req.params.publicToken}/quote`)
  }

  res.render('quote-accepted')
};

async function acceptQuote (req, res, next) {
  const publicToken = req.params.publicToken
  const authToken = req.session.token

  if (!get(req.body, 'confirm')) {
    res.locals.invalid = true
    return next()
  }

  try {
    await fetch(authToken, {
      method: 'post',
      url: `/v3/omis/public/order/${publicToken}/quote/accept`,
    })

    res.redirect(`/${publicToken}/quote/accepted`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderQuote,
  renderAcceptedQuote,
  acceptQuote,
}

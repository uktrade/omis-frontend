const { get } = require('lodash')

const { fetch } = require('../lib/api')

function renderQuote (req, res, next) {
  res.render('quote')
};

function renderAcceptedQuote (req, res, next) {
  if (!res.locals.quote.accepted_on) {
    return res.redirect(`/${res.locals.publicToken}/quote`)
  }

  res.render('quote-accepted')
};

async function acceptQuote (req, res, next) {
  const publicToken = res.locals.publicToken

  if (!get(req.body, 'confirm')) {
    res.locals.invalid = true
    return next()
  }

  try {
    await fetch({
      method: 'post',
      url: `/v3/public/omis/order/${publicToken}/quote/accept`,
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

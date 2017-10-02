const { fetch } = require('../lib/api')

function renderQuote (req, res, next) {
  res.render('quote')
};

function renderAcceptedQuote (req, res, next) {
  if (!res.locals.quote.accepted_on) {
    return res.redirect(`/${req.params.publicToken}`)
  }

  res.render('quote-accepted')
};

async function acceptQuote (req, res, next) {
  const publicToken = req.params.publicToken
  const authToken = req.session.token

  try {
    await fetch(authToken, {
      method: 'post',
      url: `/v3/omis/public/order/${publicToken}/quote/accept`,
    })

    res.redirect(`/${publicToken}/accepted`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderQuote,
  renderAcceptedQuote,
  acceptQuote,
}

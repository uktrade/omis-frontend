const { fetch } = require('../lib/api');

async function renderQuote (req, res, next) {
  const publicToken = req.params.publicToken;
  const authToken = req.session.token

  try {
    const order = await fetch(authToken, `/v3/omis/public/order/${publicToken}`);
    const quote = await fetch(authToken, `/v3/omis/public/order/${publicToken}/quote`);

    res.render('quote', {
      order,
      quote,
      publicToken,
    });
  } catch (error) {
    next(error);
  }
};

async function renderAcceptedQuote (req, res, next) {
  const publicToken = req.params.publicToken;
  const authToken = req.session.token

  try {
    const order = await fetch(authToken, `/v3/omis/public/order/${publicToken}`);
    const quote = await fetch(authToken, `/v3/omis/public/order/${publicToken}/quote`);

    if (!quote.accepted_on) {
      return res.redirect(`/${publicToken}`)
    }

    res.render('quote-accepted', {
      order,
      quote,
      publicToken,
    });
  } catch (error) {
    next(error);
  }
};

async function acceptQuote (req, res, next) {
  const publicToken = req.params.publicToken;
  const authToken = req.session.token

  try {
    const accept = await fetch(authToken, {
      method: 'post',
      url: `/v3/omis/public/order/${publicToken}/quote/accept`,
    });

    res.redirect(`/${publicToken}/accepted`)
  } catch (error) {
    next(error);
  }
}

module.exports = {
  renderQuote,
  renderAcceptedQuote,
  acceptQuote,
};

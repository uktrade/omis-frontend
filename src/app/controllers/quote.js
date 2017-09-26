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
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  renderQuote,
};

const { fetch } = require('../lib/api');

async function renderQuote (req, res, next) {
  const publicToken = req.params.publicToken;
  const token = req.session.token

  try {
    const order = await fetch(token, `/v3/omis/public/order/${publicToken}`);
    const quote = await fetch(token, `/v3/omis/public/order/${publicToken}/quote`);

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

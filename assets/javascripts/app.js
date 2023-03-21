require('../images/apple-touch-icon.png')
require('../images/favicon-192x192.png')
require('../images/favicon.ico')
require('../images/opengraph-image.png')
require('../images/dbt-invoice-logo.png')

const cookieMessage = require('./modules/cookie-message')
cookieMessage('global-cookies-banner', 'seen_cookie_message')

document.addEventListener('DOMContentLoaded', () => {
  const printLinks = document.querySelectorAll('.js-print')

  printLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      window.print()
    })
  })
})

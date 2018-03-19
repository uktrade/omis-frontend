require('../images/dit-invoice-logo.png')

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

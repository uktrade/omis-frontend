require('../images/dit-invoice-logo.png')

document.addEventListener('DOMContentLoaded', () => {
  const printLinks = document.querySelectorAll('.js-print')

  printLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      window.print()
    })
  })
})

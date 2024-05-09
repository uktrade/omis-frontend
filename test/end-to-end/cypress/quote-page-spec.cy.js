const { format, addDays } = require('date-fns')

const { formats } = require('../../../config')

describe('quote page spec', () => {
  it('where the quote is awaiting acceptance', () => {
    cy.visit(
      'http://localhost:4000/7AGZC7uaAIV-5L34J5lnZXHvFG9J1xnbBQnieAUCn-LRJpr-QA/quote'
    )
    cy.log('should render correct headings')
    cy.get('[data-test="order-history-link"]')
      .should('have.text', 'View your order history')
      .and(
        'have.attr',
        'href',
        '/7AGZC7uaAIV-5L34J5lnZXHvFG9J1xnbBQnieAUCn-LRJpr-QA'
      )
    cy.get('[class="local-header__heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="subheading"]').should(
      'have.text',
      'Order reference WHY589/23 for Canada'
    )
    cy.get('[data-test="metalist-quote"]')
      .should('contain', 'We sent it on')
      .and('contain', format(new Date(), formats.dateLong))
      .and('contain', 'It will expire on')
      .and(
        'contain',
        `${format(addDays(new Date(), 30), formats.dateLong)} (in a month)`
      )

    cy.log('should render quote')
    cy.get('[data-test="quote"]')
      .should('contain', `Date: ${format(new Date(), formats.dateLong)}`)
      .and(
        'contain',
        'Quote for the Provision of an Overseas Market Introduction Service (“OMIS”): WHY589/23 (the Quote)'
      )
      .and(
        'contain',
        'Motorleaf Global HQ of 5000 Rue Saint-Patrick, Montréal, H4E 1A8, Canada'
      )
      .and(
        'contain',
        'DBT will deliver the Services on or before the Delivery Date which shall be 7 May 2030'
      )
      .and(
        'contain',
        'The Customer Contact shall be Johnny Cakeman of Motorleaf Global HQ, 5000 Rue Saint-Patrick, Montréal, H4E 1A8, Canada and johnny@cakeman.com.'
      )
      .and(
        'contain',
        `This Quote must be accepted by you by ${format(addDays(new Date(), 30), formats.dateLong)}.`
      )

    cy.log('should render the quote acceptance elements')
    cy.get('[data-test="field-confirm-1"]').should(
      'contain',
      'I accept the Charges and the Terms and Conditions'
    )
    cy.get('[data-test="accept-quote-button"]').should(
      'have.text',
      'Accept quote'
    )
    cy.get('[data-test="reveal-quote-problem"]')
      .should('have.text', 'There is a problem with my quote')
      .click()
    cy.get('[class="c-message c-message--muted"]').should(
      'contain',
      'Get in touch with your DBT contact or email omis.orders@digital.trade.gov.uk'
    )
    cy.get('[data-test="omis-orders-email"]').should(
      'have.attr',
      'href',
      'mailto:omis.orders@digital.trade.gov.uk'
    )

    cy.log('should accept the quote')
    cy.get('[data-test="field-confirm-1"]').click()
    cy.get('[data-test="accept-quote-button"]').click()
    cy.location('pathname').should(
      'eq',
      '/7AGZC7uaAIV-5L34J5lnZXHvFG9J1xnbBQnieAUCn-LRJpr-QA/quote/accepted'
    )
  })
  it('when visiting an order where the quote is accepted', () => {
    cy.visit(
      'http://localhost:4000/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/quote'
    )
    cy.log('should render correct headings')
    cy.get('[data-test="order-history-link"]')
      .should('have.text', 'View your order history')
      .and(
        'have.attr',
        'href',
        '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ'
      )
    cy.get('[class="local-header__heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="subheading"]').should(
      'have.text',
      'Order reference RYM547/24 for Canada'
    )
    cy.get('[data-test="metalist-quote"]')
      .should('contain', 'We sent it on')
      .and('contain', format(new Date(), formats.dateLong))
      .and('contain', 'You accepted it on')

    cy.log('should render quote')
    cy.get('[data-test="quote"]')
      .should('contain', `Date: ${format(new Date(), formats.dateLong)}`)
      .and(
        'contain',
        'Quote for the Provision of an Overseas Market Introduction Service (“OMIS”): RYM547/24 (the Quote)'
      )
      .and(
        'contain',
        'Motorleaf Global HQ of 5000 Rue Saint-Patrick, Montréal, H4E 1A8, Canada'
      )
      .and(
        'contain',
        'DBT will deliver the Services on or before the Delivery Date which shall be 7 May 2030'
      )
      .and(
        'contain',
        'The Customer Contact shall be Johnny Cakeman of Motorleaf Global HQ, 5000 Rue Saint-Patrick, Montréal, H4E 1A8, Canada and johnny@cakeman.com.'
      )
      .and(
        'contain',
        `This Quote must be accepted by you by ${format(addDays(new Date(), 30), formats.dateLong)}.`
      )

    cy.log('should not display the acceptance elements')
    cy.get('[data-test="field-confirm-1"]').should('not.exist')
    cy.get('[data-test="accept-quote-button"]').should('not.exist')
    cy.get('[data-test="reveal-quote-problem"]').should('not.exist')
  })
})

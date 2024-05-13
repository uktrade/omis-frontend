const { format, addDays } = require('date-fns')

const { formats } = require('../../../config')

describe('quote page spec', () => {
  const site_url = Cypress.env('TESTING_OMIS_SITE_URL')
  
  it('where the quote is awaiting acceptance', () => {
    cy.visit(
      `${site_url}/yV-PZL8YZfFj0bE2LinEMRyg4Rq5t9c0rlB4jqqzd8ztzHwM_w/quote`
    )
    cy.log('should render correct headings')
    cy.get('[data-test="order-history-link"]')
      .should('have.text', 'View your order history')
      .and(
        'have.attr',
        'href',
        '/yV-PZL8YZfFj0bE2LinEMRyg4Rq5t9c0rlB4jqqzd8ztzHwM_w'
      )
    cy.get('[class="local-header__heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="subheading"]').should(
      'have.text',
      'Order reference UYM672/24 for Australia'
    )
    cy.get('[data-test="metalist-quote"]')
      .should('contain', 'We sent it on')
      .and('contain', '13 May 2024, 11:05am')
      .and('contain', 'It will expire on')
      .and(
        'contain',
        '12 June 2024 (in a month)'
      )

    cy.log('should render quote')
    cy.get('[data-test="quote"]')
      .should('contain', `Date: ${format(new Date(), formats.dateLong)}`)
      .and(
        'contain',
        'Quote for the Provision of an Overseas Market Introduction Service (“OMIS”): UYM672/24 (the Quote)'
      )
      .and(
        'contain',
        'A B C of 22 Chatham Road, West Sussex, WORTHING, BN11 2SP'
      )
      .and(
        'contain',
        'DBT will deliver the Services on or before the Delivery Date which shall be 5 September 2024'
      )
      .and(
        'contain',
        'The Customer Contact shall be Chuck Norris of A B C, 22 Chatham Road, West Sussex, WORTHING, BN11 2SP, United Kingdom and chuck.norris@master.com.'
      )
      .and(
        'contain',
        'This Quote must be accepted by you by 12 June 2024.'
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

  })
  it('when visiting an order where the quote is accepted', () => {
    cy.visit(
      `${site_url}/jxx_qKAyE0n8lA8LNfeRwUZ_qWO5VIn9fjUQQfZYlsaSkgYuVA/quote`
    )
    cy.log('should render correct headings')
    cy.get('[data-test="order-history-link"]')
      .should('have.text', 'View your order history')
      .and(
        'have.attr',
        'href',
        '/jxx_qKAyE0n8lA8LNfeRwUZ_qWO5VIn9fjUQQfZYlsaSkgYuVA'
      )
    cy.get('[class="local-header__heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="subheading"]').should(
      'have.text',
      'Order reference XYF252/24 for Australia'
    )
    cy.get('[data-test="metalist-quote"]')
      .should('contain', 'We sent it on')
      .and('contain', '13 May 2024, 10:38am')
      .and('contain', 'You accepted it on')

    cy.log('should render quote')
    cy.get('[data-test="quote"]')
      .should('contain', '13 May 2024')
      .and(
        'contain',
        'Quote for the Provision of an Overseas Market Introduction Service (“OMIS”): XYF252/24 (the Quote)'
      )
      .and(
        'contain',
        'A B C of 22 Chatham Road, West Sussex, WORTHING, BN11 2SP, United Kingdom'
      )
      .and(
        'contain',
        'DBT will deliver the Services on or before the Delivery Date which shall be 5 September 2024'
      )
      .and(
        'contain',
        'The Customer Contact shall be Chuck Norris of A B C, 22 Chatham Road, West Sussex, WORTHING, BN11 2SP, United Kingdom and chuck.norris@master.com.'
      )
      .and(
        'contain',
        `This Quote must be accepted by you by 12 June 2024.`
      )

    cy.log('should not display the acceptance elements')
    cy.get('[data-test="field-confirm-1"]').should('not.exist')
    cy.get('[data-test="accept-quote-button"]').should('not.exist')
    cy.get('[data-test="reveal-quote-problem"]').should('not.exist')
  })
})

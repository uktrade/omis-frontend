const { format, addDays } = require('date-fns')

const { formats } = require('../../../config')

describe('order page spec', () => {
  const site_url = Cypress.env('TESTING_OMIS_SITE_URL')

  it('when visiting an order where the quote is awaiting acceptance', () => {
    cy.visit(
      `${site_url}/yV-PZL8YZfFj0bE2LinEMRyg4Rq5t9c0rlB4jqqzd8ztzHwM_w`
    )
    cy.log('should display correct headings')
    cy.get('h1').should('have.text', 'Your order')
    cy.get('[data-test="subheading"]').should(
      'have.text',
      'Order reference UYM672/24 in Australia'
    )

    cy.log('should display Review your quote text and button')
    cy.get('[data-test="actions-heading"]').should('have.text', 'Your actions')
    cy.get('[data-test="accept-quote-text"]').should(
      'have.text',
      'Please review and accept your quote so that we can start delivering the work.'
    )
    cy.get('[data-test="review-your-quote-button"]')
      .should('contain', 'Review your quote')
      .and(
        'have.attr',
        'href',
        '/yV-PZL8YZfFj0bE2LinEMRyg4Rq5t9c0rlB4jqqzd8ztzHwM_w/quote'
      )

    cy.log('should display Your quote text')
    cy.get('[data-test="your-quote-heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="metalist-quote"]')
      .should('contain', 'We sent it on')
      .and('contain', format(new Date(), formats.dateLong))
      .and('contain', 'It will expire on')
      .and(
        'contain',
        `${format(addDays(new Date(), 30), formats.dateLong)} (in a month)`
      )
  })
  it('when visiting an order where the quote is accepted', () => {
    cy.visit(
      `${site_url}/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ`
    )
    cy.log('should display correct headings')
    cy.get('h1').should('have.text', 'Your order')
    cy.get('[data-test="subheading"]').should(
      'have.text',
      'Order reference RYM547/24 in Angola'
    )

    cy.log('should display invoice text and button')
    cy.get('[data-test="actions-heading"]').should('have.text', 'Your actions')
    cy.get('[data-test="must-pay-text"]').should(
      'have.text',
      'You must pay for your order to receive the work.'
    )
    cy.get('[data-test="pay-invoice-text"]').should(
      'have.text',
      `\n  You will need to pay\n  the invoice\n  by 18 April 2024 (in a month).\n`
    )
    cy.get('[data-test="invoice-link"]')
      .should('have.text', 'the invoice')
      .and(
        'have.attr',
        'href',
        '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/invoice'
      )
    cy.get('[data-test="payment-options-button"]')
      .should('contain', 'View payment options')
      .and(
        'have.attr',
        'href',
        '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/payment'
      )
    cy.get('[data-test="accept-quote-text"]').should('not.exist')
    cy.get('[data-test="review-your-quote-button"]').should('not.exist')

    cy.log('should display Your invoice text')
    cy.get('[data-test="invoice-heading"]').should('have.text', 'Your invoice')
    cy.get('[data-test="metalist-invoice"]')
      .should('contain', 'Invoice number')
      .and('contain', 'Created on')
      .and('contain', '19 March 2024, 12:12pm')
    cy.get('[data-test="view-invoice-link"]')
      .should('contain', 'View your invoice')
      .and(
        'have.attr',
        'href',
        '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/invoice'
      )

    cy.log('should display Your quote text')
    cy.get('[data-test="your-quote-heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="metalist-quote"]')
      .should('contain', 'We sent it on')
      .and('contain', '19 March 2024, 12:11pm')
      .and('contain', 'You accepted it on')
    cy.get('[data-test="quote-link"]')
      .should('contain', 'View your accepted quote')
      .and(
        'have.attr',
        'href',
        '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/quote'
      )
  })
  it('when visiting an order that has been paid for', () => {
    cy.visit(
      `${site_url}/wroisMNmFaEhESOS2s9fkbLzgKgkrr-PJ9cM8IF25nBCDrbX-A`
    )
    cy.log('should display correct headings')
    cy.get('h1').should('have.text', 'Your order')
    cy.get('[data-test="subheading"]').should(
      'have.text',
      'Order reference RCK178/23 in Bosnia and Herzegovina'
    )

    cy.log('should display completion box')
    cy.get('[data-test="completed-text"]').should(
      'have.text',
      'Completed work for your order will be sent directly to you by email.'
    )
    cy.get('[data-test="problem-text"]').should(
      'have.text',
      'If there are any problems, get in touch with your DBT contact or email omis.orders@digital.trade.gov.uk.'
    )
    cy.get('[data-test="omis-email"]').should(
      'have.attr',
      'href',
      'mailto:omis.orders@digital.trade.gov.uk'
    )

    cy.log('should display invoice text and button')
    cy.get('[data-test="actions-heading"]').should('have.text', 'Your actions')
    cy.get('[data-test="no-actions-text"]').should(
      'have.text',
      'You have no actions for this order.'
    )

    cy.log('should display Your invoice text')
    cy.get('[data-test="invoice-heading"]').should('have.text', 'Your invoice')
    cy.get('[data-test="metalist-invoice"]')
      .should('contain', 'Invoice number')
      .and('contain', 'Created on')
      .and('contain', '28 September 2023, 4:16pm')
      .and('contain', 'Paid on')
    cy.get('[data-test="view-invoice-link"]')
      .should('contain', 'View your invoice')
      .and(
        'have.attr',
        'href',
        '/wroisMNmFaEhESOS2s9fkbLzgKgkrr-PJ9cM8IF25nBCDrbX-A/invoice'
      )
    cy.get('[data-test="receipt-link"]')
      .should('contain', 'View your payment receipt')
      .and(
        'have.attr',
        'href',
        '/wroisMNmFaEhESOS2s9fkbLzgKgkrr-PJ9cM8IF25nBCDrbX-A/receipt'
      )

    cy.log('should display Your quote text')
    cy.get('[data-test="your-quote-heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="metalist-quote"]')
      .should('contain', 'We sent it on')
      .and('contain', '28 September 2023, 1:40pm')
      .and('contain', 'You accepted it on')
    cy.get('[data-test="quote-link"]')
      .should('contain', 'View your accepted quote')
      .and(
        'have.attr',
        'href',
        '/wroisMNmFaEhESOS2s9fkbLzgKgkrr-PJ9cM8IF25nBCDrbX-A/quote'
      )
  })
})

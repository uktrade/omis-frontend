import { acceptedQuote } from '../test-data'

describe('Invoice spec', () => {
  const order = acceptedQuote

  context('When on the invoice page', () => {
    beforeEach(() => {
      cy.visit(`http://localhost:4000/${order.public_token}/invoice`)
    })

    it('should render the invoice', () => {
      //should show the address of the company the invoice is for
      cy.contains('To')
        .should('exist')
        .parent()
        .and('contain', order.billing_company_name)
        .and('contain', order.billing_address_town)
        .and('contain', order.billing_address_1)
        .and('contain', order.billing_address_postcode)
        .and('contain', order.billing_address_country)

      // should show the invoice number and an invoice date
      cy.contains('Invoice number').should('exist')
      cy.contains('Invoice date').should('exist')

      // should show the address that the invoice has been sent from and the vat number
      cy.contains('From').should('exist')
      cy.contains('VAT number').should('exist')

      // should show the table with the order number, the description and the amount
      cy.get('[data-test="cost-table"]')
        .should('exist')
        .and('contain', order.reference)
        .and('contain', `UK Government support in ${order.primary_market.name}`)
        .and('contain', order.subtotal_cost)

      // should show payment terms with date invoice is due by
      cy.get('[data-test="payment-terms"]').should('have.text', 'Payment terms')
      cy.get('[data-test="due-date"]').should('exist')

      // should show how to pay by credit card with link to pay by this method
      cy.get('[data-test="pay-by-card"]').should(
        'have.text',
        'How to pay by credit or debit card'
      )
      cy.get('[data-test="pay-by-card-link')
        .should('have.text', 'Pay by credit or debit card')
        .and('have.attr', 'href', `/${order.public_token}/payment/card`)

      // should show how to pay by bank transfer with the amount owed
      cy.get('[data-test="pay-by-bank-transfer"]').should(
        'have.text',
        'How to pay by bank transfer'
      )
      cy.get('[data-test="order-total-cost"]')
        .should('exist')
        .and('contain', order.total_cost)
      cy.get('[data-test="reference"]')
        .should('exist')
        .and('contain', order.reference)

      // should show in case of problem section with and email link
      cy.get('[data-test="if-problem"]').should(
        'have.text',
        'In case of problems'
      )
      cy.get('[data-test="email-link"]')
        .should('have.text', 'omis.orders@digital.trade.gov.uk')
        .and('have.attr', 'href', 'mailto:omis.orders@digital.trade.gov.uk')

      // should render the 'View your order history' link
      cy.get('[data-test="view-order-history-link"]')
        .should('exist')
        .should('have.attr', 'href', `/${order.public_token}`)

      // should have a 'Print this page' link", () => {
      cy.contains('Print this page').should('exist')
    })
  })
})

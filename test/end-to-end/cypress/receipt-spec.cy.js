const { paidQuote } = require('../test-data')

describe('Reciept spec', () => {
  const site_url = Cypress.env('TESTING_OMIS_SITE_URL')
  const order = paidQuote

  context(
    "When clicking on the 'View your payment receipt' in the order page",
    () => {
      it('should take you to the receipt page', () => {
        cy.visit(`${site_url}/${order.public_token}`)
        cy.contains('View your payment receipt').click()
        cy.get('[data-test="heading"]')
          .should('exist')
          .and('have.text', 'Receipt')
      })
    }
  )

  context('When on the receipt page', () => {
    beforeEach(() => {
      cy.visit(`${site_url}/${order.public_token}/receipt`)
    })

    it('should show the address of the company the receipt is for', () => {
      cy.contains('To')
        .should('exist')
        .parent()
        .and('contain', 'One list but not tier D')
        .and('contain', '12 St George\'s Road')
        .and('contain', 'Paris')
        .and('contain', '75001')
        .and('contain', 'France')
    })

    it('should show the invoice number and a receipt date', () => {
      cy.contains('Invoice number').should('exist')
      cy.contains('Receipt date').should('exist')
    })

    it('should show the address that the receipt has been sent from and VAT number', () => {
      cy.contains('From').should('exist')
      cy.contains('VAT number').should('exist')
    })

    it('should show a table with the order number, the description and the amount', () => {
      cy.get('[data-test="cost-table"]')
        .should('exist')
        .and('contain', 'CJC167/23')
        .and('contain', 'UK Government support in Algeria')
        .and('contain', '£10.00')
    })

    it('should show the payments heading with the number of payments that were made', () => {
      cy.get('[data-test="payments-heading"]')
        .should('exist')
        .and('contain', 'Payment details')
    })

    it('should show the information for each payment', () => {
      cy.get('[data-test="payment-1"]')
        .should('exist')
        .and('contain', 'Method')
        .and('contain', 'Bacs')
        .and('contain', 'Amount received')
        .and('contain', '£10.00')
        .and('contain', 'Received on')
    })

    it("should take you to the order history page when clicking 'View you order history' link", () => {
      cy.get('[data-test="view-order-history-link"]')
        .should('exist')
        .click()
        .location('pathname')
        .should('eq', `/${order.public_token}`)

      cy.contains('Your order').should('exist')
    })

    it("should have a 'Print this page' link", () => {
      cy.contains('Print this page').should('exist')
    })
  })
})

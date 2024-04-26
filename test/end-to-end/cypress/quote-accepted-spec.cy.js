const { addMonths, format } = require('date-fns')
const { formats } = require("../../../config");

describe("quote acceptance page spec", () => {
    it("when accepting a quote", () => {
      cy.visit(
        "http://localhost:4000/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/quote/accepted"
      );

      cy.log('should render all elements correctly')
      cy.get('[data-test="confirmation-banner"]').should('contain', 'Quote accepted').and('contain', 'Your reference number is').and('contain', 'RYM547/24')
      cy.get('h3').should('have.text', 'What happens next')
      cy.get('[data-test="confirmation-text"]').should('have.text', 'You will receive a confirmation email that the quote has been accepted.')
      cy.get('[data-test="pay-invoice-text"]').should('have.text', `\n  You will need to pay\n  the invoice\n  by ${format(addMonths(new Date(), 1), formats.dateLong)} (in a month).\n`)
      cy.get('[data-test="payment-options-button"]')
      .should("contain", "View payment options")
      .and('have.attr', 'href', '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/payment')
      cy.get('[data-test="order-history-link"]').should('have.text', 'View your order history').and('have.attr', 'href', '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ')
    })
})
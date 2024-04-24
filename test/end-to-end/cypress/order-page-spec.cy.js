const { addMonths, format } = require("date-fns");
const { formats } = require("../../../config");

describe("order page spec", () => {
  it("when visiting an order where the quote is awaiting acceptance", () => {
    cy.visit(
      "http://localhost:4000/7AGZC7uaAIV-5L34J5lnZXHvFG9J1xnbBQnieAUCn-LRJpr-QA"
    );
    cy.log('should display correct headings')
    cy.get('h1').should("have.text", "Your order");
    cy.get('[data-test="subheading"]').should("have.text", "Order reference WHY589/23 in Canada")

    cy.log('should display Review your quote text and button')
    cy.get('[data-test="actions-heading"]').should('have.text', 'Your actions')
    cy.get('[data-test="accept-quote-text"]').should('have.text', 'Please review and accept your quote so that we can start delivering the work.')
    cy.get('[data-test="review-your-quote-button"]')
      .should("contain", "Review your quote")
      .and('have.attr', 'href', '/7AGZC7uaAIV-5L34J5lnZXHvFG9J1xnbBQnieAUCn-LRJpr-QA/quote');
    
    cy.log('should display Your quote text')
    cy.get('[data-test="your-quote-heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="metalist-quote"]').should('contain', 'We sent it on').and('contain', format(new Date(), formats.dateLong)).and('contain', 'It will expire on').and('contain', `${format(addMonths(new Date(), 1), formats.dateLong)} (in a month)`)
  });
  it("when visiting an order where the quote is accepted", () => {
    cy.visit(
      "http://localhost:4000/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ"
    );
    cy.log('should display correct headings')
    cy.get('h1').should("have.text", "Your order");
    cy.get('[data-test="subheading"]').should("have.text", "Order reference RYM547/24 in Canada")

    cy.log('should display invoice text and button')
    cy.get('[data-test="actions-heading"]').should('have.text', 'Your actions')
    cy.get('[data-test="must-pay-text"]').should('have.text', 'You must pay for your order to receive the work.')
    cy.get('[data-test="pay-invoice-text"]').should('have.text', `\n  You will need to pay\n  the invoice\n  by ${format(addMonths(new Date(), 1), formats.dateLong)} (in a month).\n`)
    cy.get('[data-test="invoice-link"]').should('have.text', 'the invoice').and('have.attr', 'href', '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/invoice')
    cy.get('[data-test="payment-options-button"]')
      .should("contain", "View payment options")
      .and('have.attr', 'href', '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/payment')
    cy.get('[data-test="accept-quote-text"]').should('not.exist')
    cy.get('[data-test="review-your-quote-button"]').should("not.exist")

    cy.log('should display Your invoice text')
    cy.get('[data-test="invoice-heading"]').should('have.text', 'Your invoice')
    cy.get('[data-test="metalist-invoice"]').should('contain', 'Invoice number').and('contain', '202404240001').and('contain', 'Created on').and('contain', format(new Date(), formats.dateLong))
    cy.get('[data-test="invoice-link-ml"]').should('contain', 'View your invoice').and('have.attr', 'href', '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/invoice')

    cy.log('should display Your quote text')
    cy.get('[data-test="your-quote-heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="metalist-quote"]').should('contain', 'We sent it on').and('contain', format(new Date(), formats.dateLong)).and('contain', 'You accepted it on')
    cy.get('[data-test="quote-link"]').should('contain', 'View your accepted quote').and('have.attr', 'href', '/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/quote')
  });
  it.only("when visiting an order that has been paid for", () => {
    cy.visit(
      "http://localhost:4000/h93Dn7DKvMLbUB5Yz2h5z7dL1mXXGUa_UiPNBkVoyKLmBE29YQ"
    );
    cy.log('should display correct headings')
    cy.get('h1').should("have.text", "Your order");
    cy.get('[data-test="subheading"]').should("have.text", "Order reference CJC167/23 in Canada")

    cy.log('should display completion box')
    cy.get('[data-test="completed-text"]').should('have.text', 'Completed work for your order will be sent directly to you by email.')
    cy.get('[data-test="problem-text"]').should('have.text', 'If there are any problems, get in touch with your DBT contact or email omis.orders@digital.trade.gov.uk.')
    cy.get('[data-test="omis-email"]').should('have.attr', 'href', 'mailto:omis.orders@digital.trade.gov.uk')

    cy.log('should display invoice text and button')
    cy.get('[data-test="actions-heading"]').should('have.text', 'Your actions')
    cy.get('[data-test="no-actions-text"]').should('have.text', 'You have no actions for this order.')

    cy.log('should display Your invoice text')
    cy.get('[data-test="invoice-heading"]').should('have.text', 'Your invoice')
    cy.get('[data-test="metalist-invoice"]').should('contain', 'Invoice number').and('contain', '202404240002').and('contain', 'Created on').and('contain', format(new Date(), formats.dateLong)).and('contain', 'Paid on')
    cy.get('[data-test="invoice-link-ml"]').should('contain', 'View your invoice').and('have.attr', 'href', '/h93Dn7DKvMLbUB5Yz2h5z7dL1mXXGUa_UiPNBkVoyKLmBE29YQ/invoice')
    cy.get('[data-test="receipt-link"]').should('contain', 'View your payment receipt').and('have.attr', 'href', '/h93Dn7DKvMLbUB5Yz2h5z7dL1mXXGUa_UiPNBkVoyKLmBE29YQ/receipt')

    cy.log('should display Your quote text')
    cy.get('[data-test="your-quote-heading"]').should('have.text', 'Your quote')
    cy.get('[data-test="metalist-quote"]').should('contain', 'We sent it on').and('contain', format(new Date(), formats.dateLong)).and('contain', 'You accepted it on')
    cy.get('[data-test="quote-link"]').should('contain', 'View your accepted quote').and('have.attr', 'href', '/h93Dn7DKvMLbUB5Yz2h5z7dL1mXXGUa_UiPNBkVoyKLmBE29YQ/quote')
  });
});
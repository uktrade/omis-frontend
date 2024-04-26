const { paidQuote } = require("../test-data");

describe("Reciept spec", () => {
  const order = paidQuote;

  context(
    "When clicking on the 'View your payment receipt' in the order page",
    () => {
      it("should take you to the receipt page", () => {
        cy.visit(`http://localhost:4000/${order.public_token}`);
        cy.contains("View your payment receipt").click();
        cy.get('[data-test="heading"]')
          .should("exist")
          .and("have.text", "Receipt");
      });
    }
  );

  context("When on the receipt page", () => {
    beforeEach(() => {
      cy.visit(`http://localhost:4000/${order.public_token}/receipt`);
    });

    it("should show the address of the company the receipt is for", () => {
      cy.contains("To")
        .should("exist")
        .parent()
        .and("contain", order.billing_company_name)
        .and("contain", order.billing_address_town)
        .and("contain", order.billing_address_1)
        .and("contain", order.billing_address_postcode)
        .and("contain", order.billing_address_country);
    });

    it("should show the invoice number and a receipt date", () => {
      cy.contains("Invoice number").should("exist");
      cy.contains("Receipt date").should("exist");
    });

    it("should show the address that the receipt has been sent from and VAT number", () => {
      cy.contains("From").should("exist");
      cy.contains("VAT number").should("exist");
    });

    it("should show a table with the order number, the description and the amount", () => {
      cy.get('[data-test="cost-table"]')
        .should("exist")
        .and("contain", order.reference)
        .and("contain", `UK Government support in ${order.primary_market.name}`)
        .and("contain", order.subtotal_cost);
    });

    it("should show the payments heading with the number of payments that were made", () => {
      cy.get('[data-test="payments-heading"]')
        .should("exist")
        .and("contain", "Payment details")
        .children()
        .and("contain", `(${order.payments.length} payments)`);
    });

    it("should show the information for each payment", () => {
      cy.get('[data-test="payment-1"]')
        .should("exist")
        .and("contain", "Payment 1")
        .and("contain", "Method")
        .and("contain", order.payments[0].method)
        .and("contain", "Amount received")
        .and("contain", order.payments[0].amount)
        .and("contain", "Received on");

      cy.get('[data-test="payment-2"]')
        .should("exist")
        .and("contain", "Payment 2")
        .and("contain", "Method")
        .and("contain", order.payments[1].method)
        .and("contain", "Amount received")
        .and("contain", order.payments[1].amount)
        .and("contain", "Received on");
    });

    it("should take you to the order history page when clicking 'View you order history' link", () => {
      cy.get('[data-test="view-order-history-link"]')
        .should("exist")
        .click()
        .location("pathname")
        .should("eq", `/${order.public_token}`);

      cy.contains("Your order").should("exist");
    });

    it("should have a 'Print this page' link", () => {
      cy.contains("Print this page").should("exist");
    });
  });
});

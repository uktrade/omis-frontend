import { acceptedQuote } from "../test-data";

describe("Invoice spec", () => {
  const order = acceptedQuote;

  context("Link to invoice page", () => {
    it("should take you to the invoice page when clicking 'the invoice' link", () => {
      cy.visit(`http://localhost:4000/${order.public_token}`);
      cy.get('[data-test="invoice-link"]').click();
      cy.get('[data-test="heading"]')
        .should("exist")
        .and("have.text", "Invoice");
    });

    it("should take you to the invoice page when clicking 'View your invoice'", () => {
      cy.visit(`http://localhost:4000/${order.public_token}`);
      cy.get('[data-test="view-invoice-link"]').click();
      cy.get('[data-test="heading"]')
        .should("exist")
        .and("have.text", "Invoice");
    });
  });

  context("When on the invoice page", () => {
    beforeEach(() => {
      cy.visit(`http://localhost:4000/${order.public_token}/invoice`);
    });

    it("should show the address of the company the invoice is for", () => {
      cy.contains("To")
        .should("exist")
        .parent()
        .and("contain", order.billing_company_name)
        .and("contain", order.billing_address_town)
        .and("contain", order.billing_address_1)
        .and("contain", order.billing_address_postcode)
        .and("contain", order.billing_address_country);
    });

    it("should show the invoice number and an invoice date", () => {
      cy.contains("Invoice number").should("exist");
      cy.contains("Invoice date").should("exist");
    });

    it("should show the address that the invoice has been sent from and the vat number", () => {
      cy.contains("From").should("exist");
      cy.contains("VAT number").should("exist");
    });

    it("should show the table with the order number, the description and the amount", () => {
      cy.get('[data-test="cost-table"]')
        .should("exist")
        .and("contain", order.reference)
        .and("contain", `UK Government support in ${order.primary_market.name}`)
        .and("contain", order.subtotal_cost);
    });

    it("should show payment terms with date invoice is due by", () => {
      cy.get('[data-test="payment-terms"]').should(
        "have.text",
        "Payment terms"
      );
      cy.get('[data-test="due-date"]').should("exist");
    });

    it("should show how to pay by credit card with link to pay by this method", () => {
      cy.get('[data-test="pay-by-card"]').should(
        "have.text",
        "How to pay by credit or debit card"
      );
      cy.get('[data-test="pay-by-card-link')
        .should("have.text", "Pay by credit or debit card")
        .and("have.attr", "href", `/${order.public_token}/payment/card`);
    });

    it("should show how to pay by bank transfer with the amount owed", () => {
      cy.get('[data-test="pay-by-bank-transfer"]').should(
        "have.text",
        "How to pay by bank transfer"
      );
      cy.get('[data-test="order-total-cost"]')
        .should("exist")
        .and("contain", order.total_cost);
      cy.get('[data-test="reference"]')
        .should("exist")
        .and("contain", order.reference);
    });

    it("should show in case of problem section with and email link", () => {
      cy.get('[data-test="if-problem"]').should(
        "have.text",
        "In case of problems"
      );
      cy.get('[data-test="email-link"]')
        .should("have.text", "omis.orders@digital.trade.gov.uk")
        .and("have.attr", "href", "mailto:omis.orders@digital.trade.gov.uk");
    });

    it("should take you to the order history page when clicking 'View your order history' link", () => {
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

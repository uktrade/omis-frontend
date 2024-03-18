describe("template spec", () => {
  before(() => {
    cy.visit(
      "http://localhost:4000/7AGZC7uaAIV-5L34J5lnZXHvFG9J1xnbBQnieAUCn-LRJpr-QA"
    );
  });

  it("passes", () => {
    cy.get("h1").should("exist").and("have.text", "Your order");
    cy.get('[class="button"]')
      .should("exist")
      .and("contain", "Review your quote");
  });
});

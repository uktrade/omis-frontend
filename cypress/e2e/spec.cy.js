describe("template spec", () => {
  it("visits OMIS root page", () => {
    cy.visit("http://localhost:4000");
    cy.get("h1").should("exist").and("have.text", "About this service");
  });

  it("visits OMIS order page", () => {
    cy.visit(
      "http://localhost:4000/7AGZC7uaAIV-5L34J5lnZXHvFG9J1xnbBQnieAUCn-LRJpr-QA"
    );
    cy.get("h1").should("exist").and("have.text", "Your order");
    cy.get('[class="button"]')
      .should("exist")
      .and("contain", "Review your quote");
  });
});

describe("landing page spec", () => {
  it("visits OMIS landing page", () => {
    cy.visit("http://localhost:4000");
    cy.get("h1").should("exist").and("have.text", "About this service");
  });
});

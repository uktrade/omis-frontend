describe("Pingdom", () => {
  it("Health check returns Status - OK", () => {
    cy.request("http://localhost:4000/ping.xml").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.contain("OK");
    });
  });

  it("Health check returns 503 when a dependency fails", () => {
    cy.intercept("GET", "/ping.xml", {
      statusCode: 500,
      body: "Internal Server Error"
    }).as("dependencyFail");

    cy.request({
      url: "http://localhost:4000/ping.xml",
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(503);
      expect(response.body).to.contain("Service Unavailable");
    });
  });
});

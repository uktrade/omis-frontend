describe('Pingdom - Success', () => {
  const site_url = Cypress.env('TESTING_OMIS_SITE_URL')

  it('Health check returns Status - OK', () => {
    cy.request(`${site_url}/ping.xml`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('OK')
    })
  })
})

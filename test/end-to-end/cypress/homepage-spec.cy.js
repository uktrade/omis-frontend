describe('homepage spec', () => {
  const site_url = Cypress.env('TESTING_OMIS_SITE_URL')

  it('visits OMIS root page', () => {
    cy.visit(site_url)
    cy.get('h1').should('exist').and('have.text', 'About this service')
  })
})

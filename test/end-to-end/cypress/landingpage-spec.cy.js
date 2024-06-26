describe('landing page spec', () => {
  it('visits OMIS landing page', () => {
    cy.visit('http://localhost:4000')
    cy.get('h1').should('exist').and('have.text', 'About this service')
    cy.get('[class="body"]')
      .should('exist')
      .and(
        'have.text',
        'The Overseas Market Introduction Service (OMIS) can help you find overseas customers using the Department for Business & Trade’s (DBT) network of trade specialists. Find out more about getting help from a trade specialist.'
      )
  })
  it('should click on the help link', () => {
    cy.visit('http://localhost:4000')
    cy.get('[class="link"]')
      .should('exist')
      .and('contain', 'getting help from a trade specialist')
    cy.get('[class="link"]').click()
  })
})

describe('Pingdom - Success', () => {
  it('Health check returns Status - OK', () => {
    cy.request('http://localhost:4000/ping.xml').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('OK')
    })
  })
})

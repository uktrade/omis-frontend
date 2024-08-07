describe.skip('Pingdom - Success', () => {
  it('Health check returns Status - OK', () => {
    cy.request('http://localhost:4000/pingdom/ping.xml').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.contain('OK')
    })
  })
})

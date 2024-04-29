describe('Omis Cookie Spec', () => {
  context('cookies spec', () => {
    beforeEach(() => {
      cy.visit('http://localhost:4000/cookies')
    })
    it('visits cookies page', () => {
      cy.get('[data-test="header-cookies"]')
        .should('exist')
        .and('have.text', 'Cookies')

      cy.get('[data-test="paragraph-cookie-info"]')
        .should('exist')
        .and(
          'have.text',
          'GOV.UK puts small files (known as ‘cookies’) onto your computer to collect information about how you browse the site.'
        )
      cy.get('[data-test="paragraph-cookie-useage"]')
        .should('exist')
        .and('have.text', 'Cookies are used to:')
    })
    it("should click the 'How to manage cookies link'", () => {
      cy.get('[data-test="header-title-cookies"]')
        .should('exist')
        .and('have.text', 'How cookies are used on GOV.UK')
      cy.get('[data-test="cookies-link"]')
        .should('exist')
        .and('contain', 'how to manage cookies')
        .click()
    })
    it('should click the Google analytics external link', () => {
      cy.get('[data-test="google-analytics-link"]')
        .should('exist')
        .and('contain', 'improving site search')
        .click()
    })

    it('should display information for universal analytics table', () => {
      cy.get('[data-test="table-universal-analytics"]').should('exist')
    })
    it('should display information for google analytics table', () => {
      cy.get('[data-test="table-google-analytics"]').should('exist')
    })
    it('should display information for introductory message table', () => {
      cy.get('[data-test="table-introductory-message"]').should('exist')
    })

    it('should display information for paying by credit or debit card table', () => {
      cy.get('[data-test="table-pay-by-card"]').should('exist')
    })
  })
})

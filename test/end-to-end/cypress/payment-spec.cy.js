describe('payment spec', () => {
  const site_url = Cypress.env('TESTING_OMIS_SITE_URL')
  
  it('visits OMIS payment options page', () => {
    // Visit the payment options page.
    cy.visit(
      `${site_url}/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/payment`
    )

    // Payment options page assertions.
    cy.get('h1').should('exist').and('have.text', 'Choose a payment method')
    cy.get('[data-test="payment-amount"]')
      .should('exist')
      .contains('£144.00 (£120.00 excluding VAT)')
    cy.get('[data-test="field-payment-method-1"]')
      .should('exist')
      .contains('credit or debit card')
    cy.get('[data-test="field-payment-method-2"]')
      .should('exist')
      .contains('bank transfer')
  })

  it('visits OMIS pay by bank transfer page', () => {
    // Visit payment page.
    cy.visit(
      `${site_url}/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/payment`
    )

    // Select bank transfer option and submit to go to bank transfer page.
    cy.get('[data-test="field-payment-method-2"]').click()
    cy.get('[data-test="submit-button"]').click()

    cy.get('h1').should('exist').and('have.text', 'Paying by bank transfer')

    // Assert payment amount is displayed.
    cy.get('[data-test="transfer-heading"]')
      .should('exist')
      .contains('Please make your payment in sterling for £144.00')

    // Assert DBT bank details are displayed as well as payment reference.
    cy.get('[data-test="account-name"]')
      .should('exist')
      .contains('Account Name: DBT OMIS Service')
    cy.get('[data-test="account-number"]')
      .should('exist')
      .contains('Account Number: 10014187')
    cy.get('[data-test="sort-code"]')
      .should('exist')
      .contains('Sort Code: 60-70-80')
    cy.get('[data-test="reference"]')
      .should('exist')
      .contains('Reference: RYM547/24')

    // Assert SWIFT and IBAN codes are shown.
    cy.get('[data-test="swift"]').should('exist').contains('NWBKGB2L')
    cy.get('[data-test="iban"]')
      .should('exist')
      .contains('GB57NWBK60708010014187')
  })

  it('visits OMIS pay by bank transfer and checks invoice link', () => {
    // Visit bank transfer page
    cy.visit(
      `${site_url}/XXMPH3b2185a7Vpe2f3RiI5HXT0Nshrck_6xGJuRp4UAsA6vkQ/payment/bank-transfer`
    )

    // Assert invoice link takes you to the invoice page.
    cy.get('[data-test="invoice-link"]').click()

    cy.url().should('include', '/invoice')
  })
})

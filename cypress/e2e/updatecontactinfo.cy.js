describe('Contact Info Update', () => {
  it('should update contact info and reflect it in the profile', () => {
    cy.visit('http://localhost:5173');

    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').clear().type('marco.lucio');
    cy.get(':nth-child(2) > div > .transparent-input').clear().type('hola123{enter}');

    cy.get('.nav-icons > :nth-child(2) > .bi').click();
    cy.get(':nth-child(2) > ._button_11x5d_2').click();

    cy.get('._sectionsGrid_wcydf_3 > :nth-child(1)').click();

    cy.get('#linkedin').clear().type('linkedin/marcolucio');
    cy.get('#github').clear().type('github/marcolucio');
    cy.get('#phone').clear().type('8122000001');

    // Save changes
    cy.get('._saveButton_1h03n_258').click();

    // Assert that updated LinkedIn appears in the profile contact info
    cy.contains('LinkedIn').parent().should('contain', 'linkedin/marcolucio');
  });
});

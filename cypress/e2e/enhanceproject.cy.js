describe('enhance spec', () => {
  it('enhance test', function () {
    cy.visit('http://localhost:5173');

    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').clear().type('axel.grande');
    cy.get(':nth-child(2) > div > .transparent-input').clear().type('hola123{enter}');

    cy.get('.sidebar-menu > :nth-child(2) > .bi').click();
    cy.get(':nth-child(3) > ._tabContent_uqao0_68').click();
    cy.get('a > ._buttonContainer_11x5d_22 > ._button_11x5d_2').click();

    cy.get('#description').clear().type('This is an example description. Make a fine-detailed description for an internal LLM Model for any area within the company.');

    cy.get('#description').invoke('val').then((originalText) => {
      cy.get('._enhanceButton_1fsdz_235').click();

      // Wait until textarea value is updated
      cy.get('#description', { timeout: 10000 }).should(($textarea) => {
        expect($textarea.val()).to.not.eq(originalText);
      });
    });

    // Click final button to proceed/save
    cy.get(':nth-child(1) > ._button_11x5d_2').click();
  });
});

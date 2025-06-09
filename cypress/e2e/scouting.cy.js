describe('template spec', () => {
  
})

/* ==== Test Created with Cypress Studio ==== */
it('scouting test', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:5173');
  cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').clear('a');
  cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').type('axel.grande');
  cy.get(':nth-child(2) > div > .transparent-input').clear('ho');
  cy.get(':nth-child(2) > div > .transparent-input').type('hola123{enter}');
  cy.get('.sidebar-menu > :nth-child(2)').click();
  cy.get(':nth-child(1) > ._button_11x5d_2').click();
  cy.get(':nth-child(2) > ._tabContent_uqao0_68').click();
  cy.get(':nth-child(1) > ._glassCard_c4yzm_1 > ._cardFooter_1oya9_110 > ._buttonContainer_11x5d_22 > ._button_11x5d_2').click();
  /* ==== End Cypress Studio ==== */
});
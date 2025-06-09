describe('Web application E2E test', () => {
  it('passes', () => {
    cy.visit('https://path-explorer-beta-sandy.vercel.app/')
    
  })

  /* ==== Test Created with Cypress Studio ==== */
  it('auth test', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://path-explorer-beta-sandy.vercel.app/');
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').clear('a');
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').type('axel.rose');
    cy.get(':nth-child(2) > div > .transparent-input').clear('ho');
    cy.get(':nth-child(2) > div > .transparent-input').type('hola123{enter}');
    /* ==== End Cypress Studio ==== */
  });



  
})
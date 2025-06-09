describe('CV Upload Modal Test', () => {
  it('should upload a CV file with AI', () => {
    cy.visit('http://localhost:5173');

    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').clear().type('marco.lucio');
    cy.get(':nth-child(2) > div > .transparent-input').clear().type('hola123{enter}');

    cy.get('.nav-icons > :nth-child(2) > .bi').click();
    cy.get(':nth-child(1) > ._button_11x5d_2').click();
    
    cy.window().then((win) => {
      const input = win.document.createElement('input');
      input.type = 'file';
      input.id = 'hidden-file-input';
      input.style.display = 'none';
      win.document.body.appendChild(input);
    });

    cy.fixture('Marco Lucio Resume.pdf', 'base64').then(fileContent => {
      cy.get('#hidden-file-input').attachFile(
        { fileContent, fileName: 'test-cv.pdf', mimeType: 'application/pdf', encoding: 'base64' },
        { subjectType: 'input' }
      );
    });

    cy.get('._generateButton_1h03n_594').click();

  });
});

describe('Web application E2E test', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    
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

  /* ==== Test Created with Cypress Studio ==== */
  it('E2E Requerimientos Web', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('https://path-explorer-beta-sandy.vercel.app/');
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').click();
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').clear('\' OR \'1\'=\'1');
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').type('\' OR \'1\'=\'1');
    cy.get(':nth-child(2) > div > .transparent-input').clear('\' OR \'1\'=\'1');
    cy.get(':nth-child(2) > div > .transparent-input').type('\' OR \'1\'=\'1');
    cy.get('._button_1axoa_2').click();
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('E2E Requerimientos Web', function() {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('localhost:5173');
    // auth
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').clear('a');
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').type('leo.tainy');
    cy.get(':nth-child(2) > div > .transparent-input').clear('ho');
    cy.get(':nth-child(2) > div > .transparent-input').type('hola123{enter}');
    // perfil
    cy.get('.nav-icons > :nth-child(2) > .bi').click();
    cy.get(':nth-child(2) > ._button_1axoa_2').click();
    cy.get(':nth-child(3) > ._sectionContent_wcydf_54 > ._sectionDescription_wcydf_67').click();
    cy.get('#location').clear('M');
    cy.get('#location').type('Monterrey');
    cy.get('._saveButton_1jqhl_258').click();
    // add certificate
    //cy.get('._sectionAddBtn_14f4c_24 > .bi').click();
    //cy.get('._uploadPlaceholder_1jqhl_393').click();
    // cy.get('#certificateFile').click();
    // cy.get('#title').clear('J');
    // cy.get('#title').type('Javascript Specialist');
    // cy.get('#skill').clear('J');
    // cy.get('#skill').type('JavaScript');
    // cy.get('#issuer').clear('A');
    // cy.get('#issuer').type('Coursera');
    // cy.get('#obtainedDate').click();
    // cy.get('#obtainedDate').click();
    // cy.get('#expirationDate').click();
    // cy.get('#verifyUrl').clear('h');
    // cy.get('#verifyUrl').type('https:hola.com');
    // cy.get('#verifyUrl').clear('https:.hola.com');
    // cy.get('#verifyUrl').type('https://hola.com');
    // cy.get('._saveButton_1jqhl_258').click();
    // metas
    // cy.get('.nav-icons > :nth-child(2) > .bi').click();
    //cy.get('.sidebar-menu > :nth-child(1)').click();
   // cy.get('.nav-icons > :nth-child(2) > .bi').click();
    // cy.get(':nth-child(3) > ._tabContent_18y5x_68').click();
    // cy.get(':nth-child(2) > ._button_1axoa_2').click();
    // cy.get(':nth-child(2) > ._sectionContent_wcydf_54').click();
    // cy.get('#title').clear('C');
    // cy.get('#title').type('Completar actividades de mantenimiento');
    // cy.get('#description').click();
    // cy.get(':nth-child(3) > ._primaryButton_1jqhl_257').click();
    // cy.get('#targetDate').click();
    // cy.get('._formActions_1vydo_195 > ._primaryButton_1jqhl_257').click();
    // cy.get('._saveButton_1jqhl_258').click();
    // cy.get('.sidebar-menu > :nth-child(1) > span').click();
    // cy.get('.nav-icons > :nth-child(2) > .bi').click();
    // cy.get(':nth-child(3) > ._tabContent_18y5x_68').click();
    // cy.get(':nth-child(2) > ._tabContent_18y5x_68').click();
    // cy.get(':nth-child(1) > ._tabContent_18y5x_68').click();
    // cy.get(':nth-child(3) > ._tabContent_18y5x_68').click();
    // habilidades
    // cy.get('._sectionAddBtn_lp43g_24 > .bi').click();
    // cy.get(':nth-child(1) > ._categoryHeader_yk1hp_18').click();
    // cy.get('._skillsList_yk1hp_49 > :nth-child(1)').click();
    // cy.get('._saveButton_1jqhl_258 > .bi').click();
    cy.get('.nav-icons > :nth-child(2) > .bi').click();
    cy.get('.sidebar-menu > :nth-child(2)').click();
    cy.get(':nth-child(3) > ._button_1axoa_2').click();
    cy.get(':nth-child(1) > #\\33 13').click();
    cy.get('.sidebar-menu > :nth-child(3)').click();
    // gestión de proyectos
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').clear('a');
    cy.get('.loginFormContainer > :nth-child(1) > .transparent-input').type('axel.rose');
    cy.get(':nth-child(2) > div > .transparent-input').clear('ho');
    cy.get(':nth-child(2) > div > .transparent-input').type('hola123{enter}');
    cy.get('.sidebar-menu > :nth-child(2)').click();
    cy.get(':nth-child(2) > ._tabContent_18y5x_68').click();
    cy.get(':nth-child(3) > ._tabContent_18y5x_68').click();
    cy.get('a > ._buttonContainer_1axoa_22 > ._button_1axoa_2').click();
    cy.get(':nth-child(1) > ._button_1axoa_2').click();
    // filtros/search
    cy.get('._dashboardContent_18ou4_21 > ._searchHeaderWrapper_6vggl_2 > ._searchHeader_6vggl_2 > ._searchContainer_6vggl_18 > ._searchInput_6vggl_46').clear('d');
    cy.get(':nth-child(2) > ._tabContent_18y5x_68').click();
    cy.get(':nth-child(1) > ._tabContent_18y5x_68').click();
    cy.get(':nth-child(3) > ._tabContent_18y5x_68').click();
    cy.get('._tabList_18y5x_23').click();
    cy.get(':nth-child(1) > ._tabContent_18y5x_68').click();
    cy.get('._tabList_18y5x_23 > :nth-child(3)').click();
    cy.get('._tabList_18y5x_23').click();
    cy.get(':nth-child(1) > ._tabContent_18y5x_68').click();
    cy.get('._clearFiltersButton_voodx_130').click();
    cy.get('._dashboardContent_18ou4_21 > ._searchHeaderWrapper_6vggl_2 > ._searchHeader_6vggl_2 > ._searchContainer_6vggl_18 > ._searchInput_6vggl_46').clear('d');
    cy.get('._dashboardContent_18ou4_21 > ._searchHeaderWrapper_6vggl_2 > ._searchHeader_6vggl_2 > ._searchContainer_6vggl_18 > ._searchInput_6vggl_46').type('d');
    cy.get('._clearFiltersButton_voodx_130').click();
    cy.get(':nth-child(2) > ._button_1axoa_2').click();
    cy.get('._noItemsMessage_voodx_109').click();
    cy.get('._clearFiltersButton_voodx_130').click();
    cy.get(':nth-child(2) > ._button_1axoa_2').click();
    cy.get('._dashboardContent_18ou4_21 > ._searchHeaderWrapper_6vggl_2 > ._searchHeader_6vggl_2 > ._searchContainer_6vggl_18 > ._searchInput_6vggl_46').click();
    cy.get(':nth-child(2) > ._button_1axoa_2').click();
    cy.get(':nth-child(1) > ._dropdownButton_1axoa_242').click();
    cy.get('._searchInput_yk1hp_112').clear('l');
    cy.get('._searchInput_yk1hp_112').type('lead');
    cy.get('._categoryHeader_yk1hp_18').click();
    cy.get('._skillsList_yk1hp_49 > ._skillChip_v0623_1').click();
    cy.get('._saveButton_1jqhl_258').click();
    cy.get('._userSkill_v0623_39').click();
    cy.get('.position-relative > .icon-btn > .bi').click();
    cy.get('.position-relative > .icon-btn > .bi').click();
    /* ==== End Cypress Studio ==== */
  });

})
describe("template spec", () => {
  /* ==== Test Created with Cypress Studio ==== */
  it("objectives", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit("http://localhost:5173");
    cy.get(".loginFormContainer > :nth-child(1) > .transparent-input").clear(
      "m"
    );
    cy.get(".loginFormContainer > :nth-child(1) > .transparent-input").type(
      "marco.lucio"
    );
    cy.get(":nth-child(2) > div > .transparent-input").clear("ho");
    cy.get(":nth-child(2) > div > .transparent-input").type("hola123{enter}");
    cy.get(".nav-icons > :nth-child(2) > .bi").click();
    cy.get(":nth-child(3) > ._tabContent_uqao0_68").click();
    cy.get(":nth-child(2) > ._button_11x5d_2").click();
    cy.get(
      ":nth-child(2) > ._sectionContent_wcydf_54 > ._sectionTitle_wcydf_59"
    ).click();
    cy.get("#title").clear("N");
    cy.get("#title").type("Nueva meta de prueba");
    cy.get("textarea").click();
    cy.get("#title").click();
    cy.get("#title").click();
    cy.get("#title").clear("N");
    cy.get("#title").type("New test objective");
    cy.get("textarea").click();
    cy.get("textarea").type("Example test description for being better at web dev.");
    cy.get("._generateButton_1frjb_238").click();

    cy.contains("label", "Target Date")
      .should("exist")
      .invoke("attr", "for")
      .then((id) => {
        cy.get(`#${id}`).clear().type("2025-12-31");
      });

    cy.get("._primaryButton_1h03n_257").click();
    cy.get("._saveButton_1h03n_258").click();
    cy.get(":nth-child(2) > ._button_11x5d_2").click();
    cy.get(
      ":nth-child(2) > ._sectionContent_wcydf_54 > ._sectionDescription_wcydf_67"
    ).click();
    cy.get(
      ":nth-child(2) > ._objectiveActions_1frjb_127 > ._deleteBtn_1frjb_135 > .bi"
    ).click();
    cy.get("._saveButton_1h03n_258").click();
    /* ==== End Cypress Studio ==== */
  });
});

describe("template spec", () => {
  /* ==== Test Created with Cypress Studio ==== */
  it("certs e2e", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit("http://localhost:5173");
    cy.get(".loginFormContainer > :nth-child(1) > .transparent-input").clear(
      "m"
    );
    cy.get(".loginFormContainer > :nth-child(1) > .transparent-input").type(
      "marco.lucio"
    );
    cy.get(":nth-child(2) > div > .transparent-input").clear("ho");
    cy.get(":nth-child(2) > div > .transparent-input").type("hola123");
    cy.get("._button_11x5d_2").click();
    cy.get(".nav-icons > :nth-child(2) > .bi").click();
    cy.get("._sectionAddBtn_1n0ya_25").click();
    cy.get("#title").clear("J");
    cy.get("#title").type("Javascript");
    cy.get("#skill").clear("J");
    cy.get("#skill").type("Javascript");
    cy.get("#issuer").clear("A");
    cy.get("#issuer").type("Accenture");

    cy.get('input[name="obtainedDate"]').clear().type("2023-01-01");

    cy.get("._saveButton_1h03n_258").click();
    cy.get("article")
      .last()
      .trigger("mouseover") // simulate hover so button becomes visible
      .within(() => {
        cy.get('button[title="Remove certificate"]')
          .should("be.visible")
          .click();
      });

    /* ==== End Cypress Studio ==== */
  });
});

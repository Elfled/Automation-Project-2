describe("Delete an issue and cancel deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);
    cy.visit(`${Cypress.env("baseUrl")}project/board`);

    cy.get('[data-testid="list-issue"]')
      .first()
      .click()
      .then(() => {
        cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      });
  });

  it("Should delete an issue", () => {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').contains("Delete issue").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="list-issue"]').should(
      "not.contain",
      "This is an issue of type: Task."
    );
  });

  it("Should cancel deletion of an issue", () => {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').contains("Cancel").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="icon:close"]').eq(0).click();
    cy.get('[data-testid="list-issue"]').should(
      "contain",
      "This is an issue of type: Task."
    );
  });
});

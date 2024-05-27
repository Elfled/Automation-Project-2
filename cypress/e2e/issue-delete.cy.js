function openIssueDetailView() {
  cy.get('[data-testid="list-issue"]')
    .first()
    .click()
    .then(() => {
      cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    });
}

describe("Delete an issue and cancel deleting", () => {
  beforeEach(() => {
    cy.visit("/project/board");
    cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);
    openIssueDetailView();
  });

  function deleteIssue() {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').contains("Delete issue").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="list-issue"]').should(
      "not.contain",
      "This is an issue of type: Task."
    );
  }
  function cancelDeleteIssue() {
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').contains("Cancel").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="icon:close"]').eq(0).click();
    cy.get('[data-testid="list-issue"]').should(
      "contain",
      "This is an issue of type: Task."
    );
  }
  
  it("Should delete an issue", () => {
    deleteIssue();
  });

  it("Should cancel deletion of an issue", () => {
    cancelDeleteIssue();
  });
});

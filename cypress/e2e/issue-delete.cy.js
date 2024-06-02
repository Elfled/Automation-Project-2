// Variables
const selectors = {
  listIssue: '[data-testid="list-issue"]',
  issueDetailsModal: '[data-testid="modal:issue-details"]',
  trashIcon: '[data-testid="icon:trash"]',
  confirmModal: '[data-testid="modal:confirm"]',
  closeIcon: '[data-testid="icon:close"]'
};
const baseUrl = Cypress.env("baseUrl");
const projectBoardUrl = `${baseUrl}project/board`;
const issueTypeText = "This is an issue of type: Task.";
const deleteButtonText = "Delete issue";
const cancelButtonText = "Cancel";

function openIssueDetailView() {
  cy.get(selectors.listIssue)
    .first()
    .click()
    .then(() => {
      cy.get(selectors.issueDetailsModal).should("be.visible");
    });
}

describe("Delete an issue and cancel deleting", () => {
  beforeEach(() => {
    cy.visit("/project/board");
    cy.url().should("eq", projectBoardUrl);
    openIssueDetailView();
  });
  function deleteIssue() {
    cy.get(selectors.trashIcon).click();
    cy.get(selectors.confirmModal).contains(deleteButtonText).click();
    cy.get(selectors.confirmModal).should("not.exist");
    cy.get(selectors.listIssue).should("not.contain", issueTypeText);
  }
  function cancelDeleteIssue() {
    cy.get(selectors.trashIcon).click();
    cy.get(selectors.confirmModal).contains(cancelButtonText).click();
    cy.get(selectors.confirmModal).should("not.exist");
    cy.get(selectors.closeIcon).eq(0).click();
    cy.get(selectors.listIssue).should("contain", issueTypeText);
  }
  
  it("Should delete an issue", () => {
    deleteIssue();
  });

  it("Should cancel deletion of an issue", () => {
    cancelDeleteIssue();
  });
});


import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  const issueTitle = 'This is an issue of type: Task.';

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then(() => {
      // Open issue detail modal with title
      cy.contains(issueTitle).click();
      // Ensure the modal is visible
      IssueModal.getIssueDetailModal().should('be.visible');
    });
  });

  it('Should delete issue successfully', () => {
    // Perform actions to delete the issue
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.validateIssueVisibilityState(issueTitle, false);
  });
  
  it('Should cancel deletion process successfully', () => {
    // Perform actions to cancel the deletion process
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.validateIssueVisibilityState(issueTitle, true);
  });
});


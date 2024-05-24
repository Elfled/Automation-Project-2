import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  const issueTitle = 'This is an issue of type: Task.';

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then(() => {
      cy.contains(issueTitle).click();
      IssueModal.getIssueDetailModal().should('be.visible');
    });
  });

  it('Should delete issue successfully', () => {
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.validateIssueVisibilityState(issueTitle, false);
  });
  
  it('Should cancel deletion process successfully', () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.validateIssueVisibilityState(issueTitle, true);
  });
});


// Variables
const projectBoardUrl = `${Cypress.env("baseUrl")}project/board`;
const issueIdentifier = "This is an issue of type: Task."; // Replace this with the specific issue identifier you want to test

// Functions
const openIssue = (issueIdentifier, context = "body") => {
  cy.get(context)
    .contains(issueIdentifier)
    .click()
    .then(() => {
      cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    });
};

const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

const addComment = (comment) => {
  getIssueDetailsModal().within(() => {
    cy.contains('Add a comment...')
      .click();

    cy.get('textarea[placeholder="Add a comment..."]').type(comment);

    cy.contains('button', 'Save')
      .click()
      .should('not.exist');

    cy.contains('Add a comment...')
      .should('exist');
    
    cy.get('[data-testid="issue-comment"]')
      .should('contain', comment);
  });
};

const editComment = (previousComment, newComment) => {
  getIssueDetailsModal().within(() => {
    cy.get('[data-testid="issue-comment"]')
        .contains(previousComment)
        .parents('[data-testid="issue-comment"]')
        .within(() => {
          cy.contains('Edit').click();
        });

    cy.get('textarea[placeholder="Add a comment..."]')
        .clear()
        .type(newComment);

    cy.contains('button', 'Save')
        .click()
        .should('not.exist');

    cy.get('[data-testid="issue-comment"]')
        .should('contain', 'Edit')
        .and('contain', newComment);
  });
};

const deleteComment = (commentText) => {
  getIssueDetailsModal()
    .find('[data-testid="issue-comment"]')
    .contains(commentText)
    .parents('[data-testid="issue-comment"]')
    .within(() => {
      cy.contains('Delete').click();
    });

  cy.get('[data-testid="modal:confirm"]')
    .contains('button', 'Delete comment')
    .click()
    .should('not.exist');

  getIssueDetailsModal()
    .find('[data-testid="issue-comment"]')
    .should('not.contain', commentText);
};

// Tests
describe("Issue comments creating, editing, and deleting", () => {
  beforeEach(() => {
    cy.visit(projectBoardUrl);
    openIssue(issueIdentifier);
  });

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";
    addComment(comment);
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "TEST_COMMENT";
    const newComment = "TEST_COMMENT_EDITED";

    // Create a comment to ensure there is one to edit
    addComment(previousComment);

    // Edit the comment
    editComment(previousComment, newComment);
  });

  it("Should delete a comment successfully", () => {
    const comment = "TEST_COMMENT";

    // Create a comment to ensure there is one to delete
    addComment(comment);

    // Delete the comment
    deleteComment(comment);
  });

  it("Should create, edit, and delete a comment successfully", () => {
    const comment = "HT_COMMENT";
    const newComment = "HT_COMMENT_EDITED";
   
    // Create a comment
    addComment(comment);
  
    // Edit the comment
    editComment(comment, newComment);
  
    // Delete the edited comment
    deleteComment(newComment);
  });
});

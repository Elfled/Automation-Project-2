class CommentModal {
  constructor() {
    this.issueDetailsModalSelector = '[data-testid="modal:issue-details"]';
    this.commentSelector = '[data-testid="issue-comment"]';
    this.confirmDeleteModalSelector = '[data-testid="modal:confirm"]';
    this.addCommentButton = 'button:contains("Save")';
  }

  openIssue(issueIdentifier, context = "body") {
    cy.get(context)
      .contains(issueIdentifier)
      .click()
      .then(() => {
        cy.get(this.issueDetailsModalSelector).should("be.visible");
      });
  }

  getIssueDetailsModal() {
    return cy.get(this.issueDetailsModalSelector);
  }

  addComment(comment) {
    this.getIssueDetailsModal().within(() => {
      cy.contains('Add a comment...')
        .click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains(this.addCommentButton)
        .click()
        .should('not.exist');

      cy.contains('Add a comment...').should('exist');
      cy.get(this.commentSelector).should('contain', comment);
    });
  }

  editComment(previousComment, newComment) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.commentSelector)
          .contains(previousComment)
          .parents(this.commentSelector)
          .within(() => {
            cy.contains('Edit').click();
          });

      cy.get('textarea[placeholder="Add a comment..."]')
          .clear()
          .type(newComment);

      cy.contains(this.addCommentButton)
          .click()
          .should('not.exist');

      cy.get(this.commentSelector)
          .should('contain', 'Edit')
          .and('contain', newComment);
    });
  }

  deleteComment(commentText) {
    this.getIssueDetailsModal()
      .find(this.commentSelector)
      .contains(commentText)
      .parents(this.commentSelector)
      .within(() => {
        cy.contains('Delete').click();
      });

    cy.get(this.confirmDeleteModalSelector)
      .contains('button', 'Delete comment')
      .click()
      .should('not.exist');

    this.getIssueDetailsModal()
      .find(this.commentSelector)
      .should('not.contain', commentText);
  }
}

export default CommentModal;

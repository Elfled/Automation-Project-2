class CommentModal {
  openIssue(issueIdentifier, context = "body") {
    cy.get(context)
      .contains(issueIdentifier)
      .click()
      .then(() => {
        cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      });
  }

  getIssueDetailsModal() {
    return cy.get('[data-testid="modal:issue-details"]');
  }

  addComment(comment) {
    this.getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");

      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  }

  editComment(previousComment, newComment) {
    this.getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .contains(previousComment)
        .parents('[data-testid="issue-comment"]')
        .within(() => {
          cy.contains("Edit").click();
        });

      cy.get('textarea[placeholder="Add a comment..."]')
        .clear()
        .type(newComment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", newComment);
    });
  }

  deleteComment(commentText) {
    this.getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains(commentText)
      .parents('[data-testid="issue-comment"]')
      .within(() => {
        cy.contains("Delete").click();
      });

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    this.getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.contain", commentText);
  }
}

export default CommentModal;

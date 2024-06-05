import CommentModal from "../../pages/CommentModal";

const projectBoardUrl = `${Cypress.env("baseUrl")}project/board`;
const issueIdentifier = "This is an issue of type: Task.";
const commentModal = new CommentModal();

describe("Issue comments creating, editing, and deleting", () => {
  beforeEach(() => {
    cy.visit(projectBoardUrl);
    commentModal.openIssue(issueIdentifier);
  });

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";
    commentModal.addComment(comment);
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "TEST_COMMENT";
    const newComment = "TEST_COMMENT_EDITED";

    commentModal.addComment(previousComment);
    commentModal.editComment(previousComment, newComment);
  });

  it("Should delete a comment successfully", () => {
    const comment = "TEST_COMMENT";

    commentModal.addComment(comment);
    commentModal.deleteComment(comment);
  });

  it("Should create, edit, and delete a comment successfully", () => {
    const comment = "HT_COMMENT";
    const newComment = "HT_COMMENT_EDITED";

    commentModal.addComment(comment);
    commentModal.editComment(comment, newComment);
    commentModal.deleteComment(newComment);
  });
});

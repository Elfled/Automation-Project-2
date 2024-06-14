import TimeTrackingModal from "../../pages/TimeTrackingModal";

const timeTrackingModal = new TimeTrackingModal();
const projectBoardUrl = `${Cypress.env("baseUrl")}project/board`;
const staticTitle = "TIME_TRACKING_TEST";
const staticDescriptionText = "TIME_TRACKING_TEST";
const testData = {
  initialTimeEstimation: "10",
  updatedTimeEstimation: "20",
  timeSpent: "2",
  timeRemaining: "5",
};

describe("Time tracking function", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", projectBoardUrl)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
    timeTrackingModal.createIssue(staticTitle, staticDescriptionText);
    timeTrackingModal.openIssueDetailView(staticTitle);
  });

  it("should add, edit, and remove time estimation", () => {
    timeTrackingModal.addAndVerifyTimeEstimation(
      staticTitle,
      testData.initialTimeEstimation
    );
    timeTrackingModal.editAndVerifyTimeEstimation(
      staticTitle,
      testData.updatedTimeEstimation
    );
    timeTrackingModal.removeAndVerifyTimeEstimation(staticTitle);
  });

  it("should log time and remove time successfully", () => {
    timeTrackingModal.addAndVerifyTimeEstimation(
      staticTitle,
      testData.initialTimeEstimation
    );
    timeTrackingModal.logAndVerifyTime(
      testData.timeSpent,
      testData.timeRemaining
    );
    timeTrackingModal.clearAndVerifyLoggedTime();
  });
});

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
    timeTrackingModal.fillTimeEstimation(testData.initialTimeEstimation);
    timeTrackingModal.assertTimeEstimation(testData.initialTimeEstimation);
    timeTrackingModal.closeIssueDetailView();

    timeTrackingModal.openIssueDetailView(staticTitle);
    timeTrackingModal.assertTimeEstimation(testData.initialTimeEstimation);

    timeTrackingModal.fillTimeEstimation(testData.updatedTimeEstimation);
    timeTrackingModal.assertTimeEstimation(testData.updatedTimeEstimation);
    timeTrackingModal.closeIssueDetailView();

    timeTrackingModal.openIssueDetailView(staticTitle);
    timeTrackingModal.assertTimeEstimation(testData.updatedTimeEstimation);

    timeTrackingModal.removeTimeEstimation();
    timeTrackingModal.closeIssueDetailView();

    timeTrackingModal.openIssueDetailView(staticTitle);
    timeTrackingModal.assertNoTimeEstimation();
  });

  it("should log time and remove time successfully", () => {
    timeTrackingModal.fillTimeEstimation(testData.initialTimeEstimation);
    timeTrackingModal.assertTimeEstimation(testData.initialTimeEstimation);

    timeTrackingModal.openTimeTrackingModal();
    timeTrackingModal.assertNoTimeLogged();
    timeTrackingModal.fillTimeFields(
      testData.timeSpent,
      testData.timeRemaining
    );
    timeTrackingModal.clickDoneButton();
    timeTrackingModal.assertTimeLogged(
      testData.timeSpent,
      testData.timeRemaining
    );
    timeTrackingModal.openTimeTrackingModal();
    timeTrackingModal.clearTimeFields();
    timeTrackingModal.clickDoneButton();
    timeTrackingModal.assertTimeNotLogged();
  });
});

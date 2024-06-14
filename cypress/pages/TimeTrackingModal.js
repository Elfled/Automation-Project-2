class TimeTrackingModal {
  constructor() {
    this.iconStopwatch = '[data-testid="icon:stopwatch"]';
    this.timeInputField = 'input[placeholder="Number"]';
    this.timeSpentField = 'input[name="timeSpent"]';
    this.timeRemainingField = 'input[name="timeRemaining"]';
    this.doneButton = 'button:contains("Done")';
    this.issueCreateModal = '[data-testid="modal:issue-create"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.iconClose = '[data-testid="icon:close"]';
    this.issueDetailsModal = '[data-testid="modal:issue-details"]';
  }

  fillTitleField(title) {
    cy.get('input[name="title"]').type(title);
    cy.get('input[name="title"]').should("have.value", title);
  }

  fillDescriptionField(description) {
    cy.get(".ql-editor").type(description);
    cy.get(".ql-editor").should("have.text", description);
  }

  createItemAndCloseForm() {
    cy.get('button[type="submit"]').click();
    cy.get(this.issueCreateModal).should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");
  }

  assertBacklogList() {
    cy.get(this.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]').should("have.length.gt", 0);
        cy.get('[data-testid="list-issue"]')
          .first()
          .within(() => {
            cy.get('[data-testid^="icon:"]').should("be.visible");
          });
      });
  }

  createIssue(title, description) {
    cy.get(this.issueCreateModal).within(() => {
      this.fillDescriptionField(description);
      this.fillTitleField(title);
    });

    this.createItemAndCloseForm();
    this.assertBacklogList();
  }

  openIssueDetailView(issueTitle) {
    cy.get('[data-testid="board-list:backlog"] [data-testid="list-issue"]')
      .first()
      .click()
      .then(() => {
        cy.get(this.issueDetailsModal).should("be.visible");
      });
  }

  closeIssueDetailView() {
    cy.get(this.iconClose).click();
    cy.get(this.issueDetailsModal).should("not.exist");
  }

  assertNoTimeEstimation() {
    cy.wait(2000);
    cy.get(this.timeInputField, { timeout: 20000 })
      .should("have.attr", "placeholder", "Number")
      .and("be.visible");
  }

  fillTimeEstimation(time) {
    cy.get(this.timeInputField, { timeout: 20000 }).clear().type(time);
    cy.wait(2000);
    cy.get(this.timeInputField).should("have.value", time);
  }

  assertTimeEstimation(time) {
    cy.contains(`${time}h estimated`).should("be.visible");
  }

  removeTimeEstimation() {
    cy.get(this.timeInputField, { timeout: 20000 })
      .clear()
      .type("{enter}")
      .blur();
    cy.wait(6000);
    cy.get(this.timeInputField).should("have.value", "");
    cy.get(this.issueDetailsModal).click();
    cy.reload();
  }

  openTimeTrackingModal() {
    cy.get(this.iconStopwatch).click();
  }

  assertNoTimeLogged() {
    cy.log("Asserting no time is logged");

    cy.contains("Time spent (hours)", { timeout: 20000 })
      .should("be.visible")
      .parent()
      .find(this.timeInputField)
      .should("have.attr", "placeholder", "Number")
      .and("have.value", "");

    cy.contains("Time remaining (hours)", { timeout: 20000 })
      .should("be.visible")
      .parent()
      .find(this.timeInputField)
      .should("have.attr", "placeholder", "Number")
      .and("have.value", "");
  }

  fillTimeFields(timeSpent, timeRemaining) {
    cy.contains("Time spent (hours)", { timeout: 20000 })
      .should("be.visible")
      .parent()
      .find(this.timeInputField)
      .clear()
      .type(timeSpent)
      .should("have.value", timeSpent);

    cy.contains("Time remaining (hours)", { timeout: 20000 })
      .should("be.visible")
      .parent()
      .find(this.timeInputField)
      .clear()
      .type(timeRemaining)
      .should("have.value", timeRemaining);
  }

  clickDoneButton() {
    cy.get(this.doneButton).click();
  }

  assertTimeLogged(timeSpent, timeRemaining) {
    cy.log("Asserting time is logged");

    cy.get(this.iconStopwatch).should("not.contain", "No time logged");

    cy.get(this.issueDetailsModal).within(() => {
      cy.contains(`${timeSpent}h logged`).should("be.visible");
      cy.contains(`${timeRemaining}h remaining`).should("be.visible");
    });
  }

  clearTimeFields() {
    cy.log("Clearing time fields");

    cy.contains("Time spent (hours)", { timeout: 20000 })
      .should("be.visible")
      .parent()
      .find(this.timeInputField)
      .clear()
      .should("have.value", "")
      .and("have.attr", "placeholder", "Number");

    cy.contains("Time remaining (hours)", { timeout: 20000 })
      .should("be.visible")
      .parent()
      .find(this.timeInputField)
      .clear()
      .should("have.value", "")
      .and("have.attr", "placeholder", "Number");
  }

  assertTimeNotLogged() {
    cy.contains(this.timeDisplayClass, "No time logged").should("be.visible");
    cy.contains(this.timeDisplayClass, "10h estimated").should("be.visible");
  }

  // Updated methods to simplify tests
  addAndVerifyTimeEstimation(issueTitle, time) {
    this.fillTimeEstimation(time);
    this.assertTimeEstimation(time);
    this.closeIssueDetailView();
    this.openIssueDetailView(issueTitle);
    this.assertTimeEstimation(time);
  }

  editAndVerifyTimeEstimation(issueTitle, time) {
    this.fillTimeEstimation(time);
    this.assertTimeEstimation(time);
    this.closeIssueDetailView();
    this.openIssueDetailView(issueTitle);
    this.assertTimeEstimation(time);
  }

  removeAndVerifyTimeEstimation(issueTitle) {
    this.removeTimeEstimation();
    this.closeIssueDetailView();
    this.openIssueDetailView(issueTitle);
    this.assertNoTimeEstimation();
  }

  logAndVerifyTime(timeSpent, timeRemaining) {
    this.openTimeTrackingModal();
    this.assertNoTimeLogged();
    this.fillTimeFields(timeSpent, timeRemaining);
    this.clickDoneButton();
    this.assertTimeLogged(timeSpent, timeRemaining);
  }

  clearAndVerifyLoggedTime() {
    this.openTimeTrackingModal();
    this.clearTimeFields();
    this.clickDoneButton();
    this.assertTimeNotLogged();
  }
}

export default TimeTrackingModal;

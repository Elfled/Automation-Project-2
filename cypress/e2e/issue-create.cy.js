import { faker } from "@faker-js/faker";

//Variable for function
const staticAssignee = "Lord Gaben";
// Functions
function fillTitleField(text) {
  cy.get('input[name="title"]').type(text);
  cy.get('input[name="title"]').should("have.value", text);
}
function fillDescriptionField(descriptionText) {
  cy.get(".ql-editor").type(descriptionText);
  cy.get(".ql-editor").should("have.text", descriptionText);
}
function selectDropdownOption(dropdownTestId, optionText) {
  if (optionText === "Task") {
    cy.get(`[data-testid="${dropdownTestId}"] div`).should(
      "contain",
      optionText
    );
    return;
  }
  cy.get(`[data-testid="${dropdownTestId}"]`).click();
  cy.get(`[data-testid="select-option:${optionText}"]`, {
    timeout: 10000,
  }).should("be.visible");
  cy.get(`[data-testid="select-option:${optionText}"]`).click();
  cy.get(`[data-testid="${dropdownTestId}"] div`).should("contain", optionText);
}
function createItemAndCloseForm() {
  cy.get('button[type="submit"]').click();
  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");
}
function assertBacklogList() {
  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get('[data-testid="list-issue"]').should("have.length.gt", 0);
      cy.get('[data-testid="list-issue"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="icon:"]').should("be.visible");
        });
      const assignee = staticAssignee;
      if (assignee && assignee !== "") {
        cy.get(`[data-testid="avatar:${assignee}"]`).should("be.visible");
      } else {
        cy.get('[data-testid^="avatar:"]').should("not.exist");
      }
    });
}

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    const staticDescriptionText = "TEST_DESCRIPTION";
    const staticTitle = "TEST_TITLE";

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillDescriptionField(staticDescriptionText);
      fillTitleField(staticTitle);
    });

    const dropdownSelections = [
      { dropdownTestId: "select:type", optionText: "Story" },
      { dropdownTestId: "select:reporterId", optionText: "Baby Yoda" },
      { dropdownTestId: "form-field:userIds", optionText: "Baby Yoda" },
    ];
    dropdownSelections.forEach((selection) => {
      selectDropdownOption(selection.dropdownTestId, selection.optionText);
    });
    createItemAndCloseForm();
    assertBacklogList();
  });

  it("Should create another issue with provided data and validate it successfully", () => {
    const staticDescriptionText = "My bug description";
    const staticTitle = "Bug";
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillDescriptionField(staticDescriptionText);
      fillTitleField(staticTitle);
    });

    const dropdownSelections = [
      { dropdownTestId: "select:type", optionText: "Bug" },
      { dropdownTestId: "select:reporterId", optionText: "Pickle Rick" },
      { dropdownTestId: "form-field:userIds", optionText: "Lord Gaben" },
      { dropdownTestId: "select:priority", optionText: "Highest" },
    ];
    dropdownSelections.forEach((selection) => {
      selectDropdownOption(selection.dropdownTestId, selection.optionText);
    });

    createItemAndCloseForm();
    assertBacklogList();
  });

  it("Should create another issue with random title and description and validate it successfully", () => {
    const randomTitle = faker.lorem.words(3);
    const randomDescription = faker.lorem.sentences(2);

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillDescriptionField(randomDescription);
      fillTitleField(randomTitle);
    });

    const dropdownSelections = [
      { dropdownTestId: "select:type", optionText: "Task" },
      { dropdownTestId: "select:reporterId", optionText: "Baby Yoda" },
      { dropdownTestId: "select:priority", optionText: "Low" },
    ];
    dropdownSelections.forEach((selection) => {
      selectDropdownOption(selection.dropdownTestId, selection.optionText);
    });

    createItemAndCloseForm();
    assertBacklogList();
  });
  it.only('Should validate title is required field if missing', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      cy.wait(2000);

      cy.get('[data-testid="form-field:title"]').should(
        "contain.text",
        "This field is required"
      );
    });
  });

  it("should remove leading and trailing spaces from the issue title on the board", () => {
    const description = faker.lorem.sentence();
    const originalTitle = "Hello world!";
    const titleWithSpaces = "  " + originalTitle + "  ";
    const trimmedTitle = originalTitle.trim();

    fillDescriptionField(description);
    fillTitleField(titleWithSpaces);
    createItemAndCloseForm();

    cy.wait(6000);
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.get("p.sc-kfGgVZ").first().should("contain", trimmedTitle);
    });
  });
});

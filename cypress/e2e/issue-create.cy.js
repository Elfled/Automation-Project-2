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

  it("Should validate title as required field if missing", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('button[type="submit"]')
        .should("be.visible")
        .and("not.be.disabled");
      cy.get('button[type="submit"]').click({ force: true });

      cy.document().then((doc) => {
        console.log(doc.documentElement.innerHTML);
      });
      cy.wait(2000);

      cy.get('[data-testid="form-field:title"]').should(
        "contain.text",
        "This field is required"
      );
    });
  });
});

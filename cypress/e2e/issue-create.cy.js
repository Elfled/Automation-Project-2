import { faker } from "@faker-js/faker";

//Variable for function
const staticAssignee = "Lord Gaben";
// Functions
const fillTitleField = (text) => {
  cy.get('input[name="title"]').type(text); // Type value into the "title" input field
  cy.get('input[name="title"]').should("have.value", text); // Verify that the "title" input field has the correct value
}
const fillDescriptionField = (descriptionText) => {
  cy.get(".ql-editor").type(descriptionText); // Type the provided text into the description input field
  cy.get(".ql-editor").should("have.text", descriptionText); // Verify that the description input field has the correct value
}
const selectDropdownOption = (dropdownTestId, optionText) => {
  // If the expected option is "Task" and it is the default option, no need to interact with the dropdown
  if (optionText === "Task") {
    // Verify that the selected option is displayed in the dropdown
    cy.get(`[data-testid="${dropdownTestId}"] div`).should(
      "contain",
      optionText
    );
    return;
  }
  // Click on the dropdown to open it
  cy.get(`[data-testid="${dropdownTestId}"]`).click();

  // Wait for the dropdown options to be visible
  cy.get(`[data-testid="select-option:${optionText}"]`, {
    timeout: 10000,
  }).should("be.visible");

  // Click on the desired option
  cy.get(`[data-testid="select-option:${optionText}"]`).click();

  // Verify that the selected option is displayed in the dropdown
  cy.get(`[data-testid="${dropdownTestId}"] div`).should("contain", optionText);
}
const createItemAndCloseForm = () => {
  // Submit the form
  cy.get('button[type="submit"]').click();

  // Assert that modal window is closed and successful message is visible
  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");

  // Reload the page to be able to see recently created issue
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");
}
const assertBacklogList = () => {
  // Assert that only one list with name Backlog is visible and do steps inside of it
  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      // Assert that this list contains issues
      cy.get('[data-testid="list-issue"]').should("have.length.gt", 0); // Check if there are any issues in the backlog list

      // Check the first issue in the list
      cy.get('[data-testid="list-issue"]')
        .first()
        .within(() => {
          // Assert that correct type icon is visible
          cy.get('[data-testid^="icon:"]').should("be.visible");
        });

      // Check if the assignee is expected to be present
      const assignee = staticAssignee;
      if (assignee && assignee !== "") {
        cy.get(`[data-testid="avatar:${assignee}"]`).should("be.visible");
      } else {
        // Assert that no assignee avatar is visible
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
        // System will already open issue creating modal in beforeEach block
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
      cy.get('button[type="submit"]').should("be.visible").and("not.be.disabled");
      cy.get('button[type="submit"]').click({ force: true });
      cy.document().then((doc) => {
        console.log(doc.documentElement.innerHTML);
      });
      cy.wait(6000);
      cy.get('[data-testid="form-field:title"]').should("contain.text", "This field is required");
    });
  });
  
  it("should remove leading and trailing spaces from the issue title on the board", () => {
    // Generate random text for the description using Faker
    const description = faker.lorem.sentence();

    // Define the issue title with multiple spaces
    const originalTitle = "Hello world!";
    const titleWithSpaces = "  " + originalTitle + "  ";
    const trimmedTitle = originalTitle.trim();

    // Fill the description field using the existing function
    fillDescriptionField(description);

    // Fill the title field using the existing function
    fillTitleField(titleWithSpaces);

    // Submit the form and close the modal using the existing function
    createItemAndCloseForm();

    cy.wait(6000);

    // Access the created issue title on the board (first element in the list)
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      // Ensure the first issue in the list is visible and contains the trimmed title
      cy.get("p.sc-kfGgVZ").first().should("contain", trimmedTitle);
    });
  });
});

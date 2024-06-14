const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

const selectDropdownOption = (dropdownSelector, optionText) => {
  cy.get(dropdownSelector).click("bottomRight");
  cy.get(`[data-testid="select-option:${optionText}"]`)
    .trigger("mouseover")
    .click();
};
const clickDropdownOption = (dropdownSelector, optionText) => {
  getIssueDetailsModal().within(() => {
    cy.get(dropdownSelector).click("bottomRight");
    cy.get(`[data-testid="select-option:${optionText}"]`).click();
  });
};

const assertTextInDropdown = (dropdownSelector, expectedText) => {
  getIssueDetailsModal().within(() => {
    cy.get(dropdownSelector).should("contain", expectedText);add .
  });
};

describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      selectDropdownOption('[data-testid="select:type"]', "Story");
    });

    selectDropdownOption('[data-testid="select:status"]', "Done");
    selectDropdownOption('[data-testid="select:assignees"]', "Lord Gaben");
    selectDropdownOption('[data-testid="select:assignees"]', "Baby Yoda");
    selectDropdownOption('[data-testid="select:reporter"]', "Pickle Rick");
    selectDropdownOption('[data-testid="select:priority"]', "Medium");
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it("Should check the options of Priority dropdown", () => {
    const prioritySelection = '[data-testid="select:priority"]';
    const selectOptions = '[data-testid^="select-option:"]';

    const priorities = [];
    const expectedLengthPriority = 5;

    getIssueDetailsModal().within(() => {
      cy.get(prioritySelection)
        .invoke("text")
        .then((selectedPriority) => {
          priorities.push(selectedPriority.trim());
          cy.log(`Length of array: ${priorities.length}`);
        });

      cy.get(prioritySelection).click();

      cy.get(selectOptions)
        .each(($el) => {
          cy.wrap($el)
            .invoke("text")
            .then((priorityOption) => {
              priorities.push(priorityOption.trim());
              cy.log(`Value added: ${priorityOption.trim()}`);
              cy.log(`Length of array: ${priorities.length}`);
            });
        })
        .then(() => {
          priorities.reverse();

          cy.wrap(null).then(() => {
            expect(priorities.length).to.eq(expectedLengthPriority);
            cy.log(`Priorities array: ${priorities}`);
          });
        });
    });
  });

  it("Should have only characters in the reporter name", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]').each(($reporter) => {
        cy.wrap($reporter)
          .invoke("text")
          .then((reporterName) => {
            expect(reporterName.trim()).to.match(/^[A-Za-z\s]+$/);
          });
      });
    });
  });
});

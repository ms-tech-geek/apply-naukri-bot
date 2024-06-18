// cypress/e2e/applyJobs.js

describe('Naukri Job Application Automation', () => {
  const username = 'thecorporator@gmail.com'; // Your naukri.com email
  const password = 'D3f@u!0r'; // Your naukri.com password
  const keywords = 'react developer';
  const location = 'gurgaon';

  before(() => {
    // Catch and ignore uncaught exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Returning false here prevents Cypress from failing the test
      return false;
    });
  });

  it('logs in and applies for jobs', () => {
    // Intercept network requests
    cy.intercept('GET', '**/').as('naukriHome');

    // Visit Naukri.com homepage
    cy.visit('https://www.naukri.com');
    cy.wait('@naukriHome');

    // Log URL to confirm
    cy.url().should('include', 'naukri.com');
    cy.log('Visited Naukri Homepage');

    // Click on the login button
    cy.contains('Login').click();
    cy.log('Clicked Login');

    // Enter username
    cy.get('input[placeholder="Enter your active Email ID / Username"]').type(
      username
    );
    cy.log('Entered Username');

    // Enter password
    cy.get('input[placeholder="Enter your password"]').type(password);
    cy.log('Entered Password');

    // Submit the login form
    cy.get('button[type="submit"]').click();
    cy.log('Submitted Login Form');

    // Wait for 10 seconds for login to complete
    cy.wait(10000);

    // Perform job search
    cy.get('.nI-gNb-sb__main').click();
    cy.log('Click on Search Bar');

    // Wait for 3 seconds
    cy.wait(3000);

    // Enter keywords for search
    cy.get(
      '.nI-gNb-sb__keywords > .nI-gNb-sugg > .suggestor-wrapper > .suggestor-box > .suggestor-input'
    )
      .type(keywords)
      .log('Entered Keywords');

    // Enter location for search
    cy.get(
      '.nI-gNb-sb__locations > .nI-gNb-sugg > .suggestor-wrapper > .suggestor-box > .suggestor-input'
    )
      .type(location)
      .log('Entered Location');

    // Click on search button and wait for listings
    cy.get('.nI-gNb-sb__icon-wrapper').click();
    cy.wait(5000);
    cy.log('Performed Job Search');

    // Loop through job listings and apply
    cy.get('.jobTuple').each(($el, index, $list) => {
      cy.wrap($el).within(() => {
        // Check if the job is already applied
        cy.get('.appliedIcon').then(($icon) => {
          if ($icon.length === 0) {
            // Click on the job title
            cy.get('.title').click();
            cy.log('Clicked on Job Title');

            // Click on the apply button
            cy.contains('Apply').click();
            cy.log('Clicked Apply');

            // Wait for the apply process to complete
            cy.wait(2000);
            cy.log('Applied for Job');

            // Go back to the job listings
            cy.go('back');
            cy.log('Returned to Job Listings');
          }
        });
      });
    });
  });
});

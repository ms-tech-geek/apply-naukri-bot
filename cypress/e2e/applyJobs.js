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

    // Extract job links
    const jobLinks = [];
    cy.get('[class="srp-jobtuple-wrapper"] a')
      .each(($el) => {
        let link = $el.attr('href');
        if (link && !link.startsWith('http')) {
          link = `https://www.naukri.com${link}`;
        }
        jobLinks.push(link);
      })
      .then(() => {
        cy.wrap(jobLinks).each((link) => {
          if (link) {
            cy.visit(link);
            cy.log('Visited Job Link: ' + link);

            // Wait for the apply button to be visible
            cy.contains('Apply', { timeout: 10000 })
              .should('be.visible')
              .click();
            cy.log('Clicked Apply');

            // Wait for the apply process to complete
            cy.wait(2000);
            cy.log('Applied for Job');

            // Go back to the search results
            cy.go('back');
            cy.wait(3000); // Wait for the search results page to load
          }
        });
      });
  });
});

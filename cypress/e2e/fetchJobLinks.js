const fs = require('fs');

describe('Naukri Job Application Automation', () => {
  const username = 'thecorporator@gmail.com'; // Your naukri.com email
  const password = 'D3f@u!0r'; // Your naukri.com password
  const keywords = 'react developer';
  const location = 'gurgaon';

  before(() => {
    // Catch and ignore uncaught exceptions
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    // Increase default timeout
    Cypress.config('defaultCommandTimeout', 60000);
    Cypress.config('pageLoadTimeout', 60000);
  });

  it('logs in to Naukri and performs a job search', () => {
    // Intercept network requests
    cy.intercept('GET', '**/').as('naukriHome');

    // Visit Naukri.com homepage
    cy.visit('https://www.naukri.com', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      },
    });
    cy.wait('@naukriHome');
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

    // Wait for login to complete
    cy.wait(3000);

    // Perform job search
    cy.get('.nI-gNb-sb__main').click();
    cy.log('Clicked on Search Bar');

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

    // Extract job links and save to JSON files
    const internalSiteJobs = [];
    const externalSiteJobs = [];
    cy.get('[class="srp-jobtuple-wrapper"] a')
      .each(($el) => {
        let link = $el.attr('href');
        if (link && !link.startsWith('http')) {
          link = `https://www.naukri.com${link}`;
        }
        cy.log('Extracted link: ' + link);

        if (link.includes('naukri.com')) {
          internalSiteJobs.push(link);
        } else {
          externalSiteJobs.push(link);
        }
      })
      .then(() => {
        cy.writeFile(
          'cypress/fixtures/internalSiteJobs.json',
          internalSiteJobs
        );
        cy.writeFile(
          'cypress/fixtures/externalSiteJobs.json',
          externalSiteJobs
        );
        cy.log('Saved internal job links to internalSiteJobs.json');
        cy.log('Saved external job links to externalSiteJobs.json');
      });
  });

  it.only('opens the first internal job link', () => {
    cy.readFile('cypress/fixtures/internalSiteJobs.json').then((jobLinks) => {
      if (jobLinks.length > 0) {
        const firstJobLink = jobLinks[0];
        cy.log('Opening first job link: ' + firstJobLink);

        // Read headers and cookies from JSON files
        cy.readFile('cypress/fixtures/headers.json').then((headers) => {
          cy.readFile('cypress/fixtures/cookies.json').then((cookies) => {
            // Visit the first job link with headers
            cy.visit(firstJobLink, {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
              },
            });
            cy.log('Visited first job link: ' + firstJobLink);
          });
        });
      } else {
        cy.log('No job links found in internalSiteJobs.json');
      }
    });
  });
});

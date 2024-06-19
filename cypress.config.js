const fs = require('fs');

describe('Fetch Job Links from Naukri', () => {
  const username = 'thecorporator@gmail.com'; // Your Naukri email
  const password = 'D3f@u!0r'; // Your Naukri password
  const keywords = 'react developer';
  const location = 'gurgaon';

  before(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    Cypress.config('defaultCommandTimeout', 60000);
    Cypress.config('pageLoadTimeout', 60000);
  });

  it('logs in to Naukri and fetches job links', () => {
    cy.visit('https://www.naukri.com');
    cy.contains('Login').click();

    cy.get('input[placeholder="Enter your active Email ID / Username"]').type(
      username
    );
    cy.get('input[placeholder="Enter your password"]').type(password);
    cy.get('button[type="submit"]').click();

    cy.wait(10000);

    cy.get('.nI-gNb-sb__main').click();
    cy.wait(3000);

    cy.get('.nI-gNb-sb__keywords .suggestor-input').type(keywords);
    cy.get('.nI-gNb-sb__locations .suggestor-input').type(location);
    cy.get('.nI-gNb-sb__icon-wrapper').click();
    cy.wait(5000);

    const internalSiteJobs = [];
    cy.get('[class="srp-jobtuple-wrapper"] a')
      .each(($el) => {
        let link = $el.attr('href');
        if (link && !link.startsWith('http')) {
          link = `https://www.naukri.com${link}`;
        }
        internalSiteJobs.push(link);
      })
      .then(() => {
        cy.writeFile(
          'cypress/fixtures/internalSiteJobs.json',
          internalSiteJobs
        );
      });
  });
});

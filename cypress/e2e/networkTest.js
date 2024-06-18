// cypress/e2e/networkTest.js

describe('Network Connectivity Test', () => {
  it('should visit Google', () => {
    cy.visit('https://www.google.com');
    cy.get('input[name="q"]').should('be.visible'); // Verify the search box is visible
  });
});

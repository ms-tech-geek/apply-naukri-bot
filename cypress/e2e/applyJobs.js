const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

// Utility function to introduce delay
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Set headless to false to see the browser
  const page = await browser.newPage();

  // Read job URLs from JSON file
  const jobLinks = JSON.parse(
    fs.readFileSync('cypress/fixtures/internalSiteJobs.json')
  );

  // Load credentials and job search parameters from environment variables
  const username = process.env.NAUKRI_USERNAME;
  const password = process.env.NAUKRI_PASSWORD;

  // Log in to Naukri
  await page.goto('https://www.naukri.com/');
  await page.click('a[data-ga-track="Main Navigation LogIn"]');
  await page.type(
    'input[placeholder="Enter your active Email ID / Username"]',
    username
  );
  await page.type('input[placeholder="Enter your password"]', password);
  await page.click('button[type="submit"]');

  // Wait for login to complete
  await delay(10000);

  for (const jobLink of jobLinks) {
    try {
      // Open job link
      await page.goto(jobLink, { waitUntil: 'networkidle2' });
      console.log(`Visited job link: ${jobLink}`);

      // Wait for the apply button to be visible
      const applyButtonSelector = 'button:contains("Apply")';
      await page.waitForSelector(applyButtonSelector, {
        visible: true,
        timeout: 10000,
      });

      // Scroll to the apply button to ensure it is in view
      await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollIntoView();
        }
      }, applyButtonSelector);

      // Click the apply button
      await page.click(applyButtonSelector);
      console.log(`Applied for job: ${jobLink}`);

      // Wait for the application process to complete
      await delay(2000);
    } catch (error) {
      console.error(`Failed to apply for job: ${jobLink}`, error);

      // Capture a screenshot if an error occurs
      await page.screenshot({ path: `error_screenshot_${Date.now()}.png` });
    }
  }

  await browser.close();
})();

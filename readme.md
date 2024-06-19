# Apply Naukri Bot

This project automates the job application process on Naukri.com using Puppeteer and Cypress.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/apply-naukri-bot.git
   cd apply-naukri-bot
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project directory and add your credentials and job search parameters:

   ```plaintext
   NAUKRI_USERNAME=your-email@example.com
   NAUKRI_PASSWORD=yourpassword
   JOB_KEYWORDS=react developer
   JOB_LOCATION=gurgaon
   ```

4. Ensure the `.env` file is added to `.gitignore` to prevent sensitive information from being pushed to the repository:

   ```plaintext
   # .gitignore
   .env
   ```

5. Fetch job links using Cypress:

   ```bash
   npx cypress open
   ```

   - Run the `fetchJobs.js` script to save job URLs to `cypress/fixtures/internalSiteJobs.json`.

6. Apply for jobs using Puppeteer:
   ```bash
   node applyJobs.js
   ```

## Usage

- The script logs in to Naukri.com using the credentials provided in the `.env` file.
- It fetches job URLs based on the specified keywords and location.
- It then navigates to each job URL and applies for the job.

## Scripts

### `fetchJobs.js`

This script logs in to Naukri.com and fetches job links based on the keywords and location specified in the `.env` file. The job links are saved to `cypress/fixtures/internalSiteJobs.json`.

### `applyJobs.js`

This script reads the job links from `cypress/fixtures/internalSiteJobs.json`, logs in to Naukri.com, and applies for each job.

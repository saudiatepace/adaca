const { chromium } = require('playwright');  // Import Playwright
const chai = require('chai');  // Import Chai for assertions
const expect = chai.expect;
const testData = require('../testdata/testData.json');  // Import test data

describe('Playwright Test Suite', function () {
  this.timeout(40000);  // Increase timeout to 40 seconds to allow for slower page loads

  let browser, page;

  // Before all tests, launch the browser and perform login
  before(async function () {
    browser = await chromium.launch({ headless: false });  // Launch browser
    const context = await browser.newContext();
    page = await context.newPage();

    // Navigate to Asana login page
    await page.goto('https://app.asana.com/-/login');

    // Locate and fill the email input field
    await page.fill('input[type="email"]', testData[0].email);

    // Click on the login button to proceed
    await page.click('.loginButton');

    // Locate and fill the password input field
    await page.fill('input[type="password"]', testData[0].password);

    // Click login button again to submit credentials
    await page.click('.loginButton');

    // Wait until the homepage is fully loaded
    await page.waitForSelector('.HomePageContent-content', { timeout: 15000 });
  });

  // After all tests, close the browser
  after(async function () {
    await browser.close();
  });

  it('should create a new task', async function () {
    // Click the "Create Task" button to add a new task
    await page.click('.MyTasksWidgetContent-addTaskButton');

    // Wait for the task name input field to appear and enter the task name
    await page.fill('.TaskName-input', testData[0].task);
  });

  it('should delete task', async function () {
    // Navigate to the "My Tasks" section
    await page.click('.SidebarTopNavLinks-myTasksButton');

    // Navigate back to the home page
    await page.click('.SidebarTopNavLinks-homeButton');

    // Locate the newly created task row
    await page.click('.MyTasksWidgetTaskRow-task');

    // Move the focus to the element to ensure visibility before right-clicking
    await page.hover('.MyTasksWidgetTaskRow-task');

    // Perform right-click action on the task row
    await page.click('.MyTasksWidgetTaskRow-task', { button: 'right' });

    // Wait for the trash icon in the context menu to appear and be clickable
    await page.waitForSelector('.Icon.TrashIcon', { timeout: 10000 });
    await page.click('.Icon.TrashIcon');
  });

});

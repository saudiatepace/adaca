const { test, expect } = require('@playwright/test');
const testData = require('../testdata/testData.json');  // Import the test data

test.describe('Data-Driven Playwright Test', () => {
  let page;

  // Before all tests, set up the browser
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
  });

  // After all tests, close the browser
  test.afterAll(async () => {
    await page.close();
  });

  // Iterate through test data to perform login and task creation for each user
  for (const data of testData) {
    test(`should create a new task for ${data.email}`, async () => {
      await page.goto('https://app.asana.com/-/login');

      // Fill the email field
      await page.fill('input[type="email"]', data.email);

      // Click the login button
      await page.click('.loginButton');

      // Fill the password field
      await page.fill('input[type="password"]', data.password);

      // Submit the login form
      await page.click('.loginButton');

      // Wait for homepage to load
      await page.waitForSelector('.HomePageContent-content', { timeout: 15000 });

      // Click the "Create Task" button
      await page.click('.MyTasksWidgetContent-addTaskButton');

      // Enter task name from test data
      await page.fill('.TaskName-input', data.task);

      // Verify task is added to the list
      await page.waitForSelector('.MyTasksWidgetTaskList', { timeout: 10000 });
      const taskList = await page.$$eval('.MyTasksWidgetTaskList', items => items.map(item => item.textContent.trim()));

      expect(taskList).toContain(data.task);

      console.log(`Test Passed: Task "${data.task}" created successfully for ${data.email}`);
    });
  }
});

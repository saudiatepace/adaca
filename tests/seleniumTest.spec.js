const { Builder, By, until } = require('selenium-webdriver');  
const chai = require('chai');  
const expect = chai.expect;
const testData = require('../testdata/testData.json');  // Import the test data

describe('Selenium Test', function () {
    this.timeout(40000);  // Increase timeout to 40 seconds to allow for slower page loads

    let driver;

    // Before all tests, initialize the WebDriver and perform login
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();  // Launch Chrome browser
        await driver.manage().setTimeouts({ implicit: 5000 });  // Set global implicit wait of 5 seconds for element search

        // Navigate to Asana login page
        await driver.get('https://app.asana.com/-/login');  

        // Locate and fill the email input field
        let emailInput = await driver.wait(until.elementLocated(By.css('input[type="email"]')), 15000);
        await emailInput.sendKeys(testData[0].eamil);  // Enter email address

        // Click on the login button to proceed
        let submitButton = await driver.wait(until.elementLocated(By.className('loginButton')), 10000);
        await submitButton.click();  

        // Locate and fill the password input field
        let passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 15000);
        await passwordInput.sendKeys(testData[0].password);  // Enter password

        // Click login button again to submit credentials
        await driver.findElement(By.className('loginButton')).click();

        // Wait until the homepage is fully loaded
        await driver.wait(until.elementLocated(By.className('HomePageContent-content')), 15000);
    });

    // After all tests, close the browser
    after(async function () {
        await driver.quit();  // Quit the browser and clean up resources
    });

    it('should create a new task', async function () {
        // Click the "Create Task" button to add a new task
        await driver.findElement(By.className('MyTasksWidgetContent-addTaskButton')).click();
    
        // Wait for the task name input field to appear and enter the task name
        let taskName = await driver.wait(until.elementLocated(By.className('TaskName-input')), 15000);
        await taskName.sendKeys(testData[0].task);  // Enter new task name
    });

    it('should verify created task is on the list', async function () {
        // Define the text to search for in the list
        const expectedText = testData[0].task;

        // Wait for the task list to load
        await driver.wait(until.elementLocated(By.className('MyTasksWidgetTaskList')), 10000);

        // Collect all list items and extract their text content
        let listItems = await driver.findElements(By.className('MyTasksWidgetTaskList'));

        // Ensure list items are found before proceeding
        if (listItems.length === 0) {
            throw new Error('No tasks found in the task list');
        } 

        // Extract text content from each list item
        let texts = await Promise.all(listItems.map(async (item) => await item.getText()));

        // Chai assertion to check if the expected text is included in the list
        expect(texts).to.include(expectedText);
    });

    it('should delete task', async function () {
        // Navigate to the "My Tasks" section
        let myTaskNav = await driver.wait(until.elementLocated(By.className('SidebarTopNavLinks-myTasksButton')), 15000);
        await myTaskNav.click();

        // Navigate back to the home page
        let homeNav = await driver.wait(until.elementLocated(By.className('SidebarTopNavLinks-homeButton')), 15000);
        await homeNav.click();

        // Locate the newly created task row
        let taskRow = await driver.wait(until.elementLocated(By.className('MyTasksWidgetTaskRow-task')), 15000);
        await taskRow.click();  // Click the task row to select it

        // Move the focus to the element to ensure visibility before right-clicking
        let actions = driver.actions({ async: true });
        await actions.move({ origin: taskRow }).perform();

        // Perform right-click action on the task row
        await actions.contextClick(taskRow).perform();

        // Wait for the trash icon in the context menu to appear and be clickable
        let trashIcon = await driver.wait(until.elementIsVisible(driver.findElement(By.className('Icon TrashIcon'))), 10000);
        await driver.wait(until.elementIsEnabled(trashIcon), 10000);

        // Click the trash icon to delete the task
        await trashIcon.click();
    });

});

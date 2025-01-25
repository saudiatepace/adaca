const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  reporter: [
    ['dot'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright']
  ],
});

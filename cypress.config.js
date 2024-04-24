const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // projectId: "some-id",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

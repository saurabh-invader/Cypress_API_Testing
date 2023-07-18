const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    username: "Saurabh_test@gmail.com",
    password: "Pass@134",
  },
  e2e: {
    baseUrl: "http://localhost:4200",
    experimentalStudio: true,
  },
  // setupNodeEvents(on, config){
  //   const version = config.env.version || 'local'
  //   config.env = require(`./cypress/config/${version}.json`)
  //   config.baseUrl = config.env.baseUrl
  //   return config
  // }
});

const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        specPattern: 'etoe_cypress/**/*.js',
        supportFile: false
    }
});
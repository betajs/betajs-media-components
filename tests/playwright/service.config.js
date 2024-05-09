const { defineConfig, devices } = require('@playwright/test');
const config = require('./config');

require('dotenv').config({
    file: `${__dirname}/.env-service`,
});

const URL = process.env.PLAYWRIGHT_URL || 'http://localhost';
const PORT = process.env.PLAYWRIGHT_PORT || 5050;
const baseURL = `${URL}:${PORT}`
const os = process.env.PLAYWRIGHT_OS || 'linux';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
    ...config,
    ...{
        workers: 5,
        ignoreSnapshots: true,
        use : {
            connectOptions: {
                os,
                // in case your localhost will be run on remote server like, MS Azure
                // exposeNetwork: '<loopback>'
            }
        }
    },
    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: `node node_modules/nano-media-server/server.js --staticserve . --port=${PORT}`,
    //   url: baseURL + '/static',
    //   reuseExistingServer: !process.env.CI,
    // },
});

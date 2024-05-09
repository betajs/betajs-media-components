const { defineConfig } = require('@playwright/test');
const config = require('./config');

require('dotenv').config({
    file: `${__dirname}/.env.actions`,
});

const os = process.env.PLAYWRIGHT_OS || 'linux';

// const baseURL = `${URL}:${PORT}`

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
    ...config,
    ...{
        workers: 2,
        ignoreSnapshots: true,
        use : {
            connectOptions: {
                os,
                // in case your localhost will be run on remote server like, MS Azure
                // exposeNetwork: '<loopback>'
            }
        },
        webServer: {}
    },
});

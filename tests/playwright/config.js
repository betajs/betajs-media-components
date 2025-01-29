const { defineConfig, devices } = require('@playwright/test');
const {BROWSER_LAUNCH_PATH} = require("./consts");

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
const PORT = process.env?.PLAYWRIGHT_PORT || 5012;
const CI = process.env?.CI === true || process.env?.CI === "true";

const config = {
    testDir: './',
    outputDir: './output',
    updateSnapshots: 'all', // "all"|"none"|"missing"
    // snapshotDir: './screenshots',
    snapshotPathTemplate: './snapshot/__TEST__-__SUITE__-__USERAGENT__-__LOCALE___-__DIFFERENCE__.png',
    screenshotDir: './screenshots',
    // screenshotPathTemplate: './screenshots/__TEST__-__SUITE__-__USERAGENT__-__LOCALE___-__DARKMODE__.png',

    /* Run tests in files in parallel */
    fullyParallel: !CI,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!CI,
    /* Retry on CI only */
    retries: CI ? 5 : 0,
    /* Opt out of parallel tests on CI. */
    workers: CI ? 1 : undefined,

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        [CI ? 'dot' : 'list', {
            stdout: true, outputFile: './reports/list-results.txt'
        }],
        ['json', { outputFile: './reports/json-results.json' }],
        ['html', { outputFolder: './reports', open: 'always' }]
    ],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: `https://localhost:${PORT}`,
        ignoreHTTPSErrors: true,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                launchOptions: {
                    executablePath: BROWSER_LAUNCH_PATH,
                }
            },
        },

        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        //
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
        //
        // /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],
    webServer: {
        // npm install -g http-server && `http-server ./ -p ${PORT} > http-server.log 2>&1 &`
        // command: `node ../../node_modules/nano-media-server/server.js --staticserve ../../ --port='${PORT}'`,
        // url: `http://127.0.0.1:${PORT}`,
        command: `npm run server -- --port='${PORT}' --sslkey='tests/playwright/html/certs/localhost-key.pem' --sslcert='tests/playwright/html/certs/localhost.pem'`,
        reuseExistingServer: !CI,
    }
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig(config);

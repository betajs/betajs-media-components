import { test, expect, chromium } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    CHROME_LOCATION, defaultPlayerAttributes, AD_TAG_URL
} from "../../consts.js";
import playerPageClass from "../../classes/PlayerPageClass";

// https://try.playwright.tech/?e=page-screenshot
// '?ad=1&blk=1&si=1&os=1&ap=1&ac=1&stk=0&sbr=1&flt=1&cmp=1';

test.describe('Testing Player Ads On AutoPlay', () => {

    test.describe.configure({
        headless: false,
        // mode: 'default',
        retries: 0,
        timeout: 20_000,
        viewport: { width: 1280, height: 720 },
        // video: 'on-first-retry',
    });

    test.beforeEach(async ({ page }) => {
        // // await playerPage.response.allHeaders();
        //
        // const i = await playerPage.setPlayerInstance();
        // console.log("insance ", i);
        // await page.waitForTimeout(1000);
        // await playerPage.playerInstace.waitForEvent('ready');
    });

    test(`The video should start in a muted state by default`, async (
        { page, browserName, context }, testInfo
    ) => {

        await (async () => {
            // const browser = await firefox.launch();
            const browser = await chromium.launch({
                // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
                // channel: 'chrome-canary',
                // chromiumSandbox: true,
                headless: false, // If headless is true, player will start with user interaction
                devtools: true,
                executablePath: `/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary`,
            });
            const page = await browser.newPage();
            const playerPage = new PlayerPage(page, Object.assign({}, defaultPlayerAttributes, {
                autoplay: true,
                width: 640, height: 360,
                adtagurl: AD_TAG_URL,
            }), [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await playerPage.goto();
            await playerPage.setPlayerInstance();

            const result = await playerPage.listenPlayerEvent('change:ready');
            console.log(`result of change ${result}`);

            const isReady = await playerPage.getPlayerAttribute('ready');
            expect(isReady).toBeTruthy();

            const adsContainer = await playerPage.adsPlayerContainerVisible();
            console.log("Ads Con", adsContainer);

            // const adsContainer = await playerPage.adsPlayerContainerVisible();
            // adsContainer.hover();

            // Mute sound, Mute sound
            const unmute = await playerPage.page.getByTitle('Unmute sound')
                .locator('div');

            const screenShotTitle = `./tests/playwright/screenshots/${(testInfo.title.replaceAll(' ', '-')).slice(0, 20)}-${browserName}.png`;

            // await browser.close();
        })();

        // const ifr = await playerPage.page.evaluate(async () => {
        //     const iframe = document.querySelector('iframe[src*="imasdk.googleapis.com/js/core/bridge"]');
        //     if (iframe)
        //         iframe.sandbox = `allow-scripts allow-same-origin allow-popups allow-forms`;
        // });
        // console.log("ifr ", ifr);
        // const frame = await playerPage.page.frame({ url: '/*imasdk.googleapis.*/'});
        // playerPage.page.frames();

        // const isAutoPlay = await playerPage.getPlayerAttribute('autoplay');
        // expect(isAutoPlay).toBeTruthy();
        // const frame = await playerPage.page.frame({ url: '/*imasdk.googleapis.com/js/core/bridge*/'});
        // const bridgeFrame = await playerPage.page.frameLocator({ url: '/*imasdk.googleapis.com/js/core/bridge*/'});
        // const frames = await playerPage.page.frames();
        // bridgeFrame.evaluate((frame) => {
        //     frame.sandbox = "allow-scripts allow-same-origin allow-popups allow-forms";
        // }, bridgeFrame);
        // const d = await bridgeFrame.first();
        // console.log("bridgeFrame ", d.sandbox);
        // await playerPage.page.evaluate((frame) => {
        //     frame.sandbox = "allow-scripts allow-same-origin allow-popups allow-forms";
        //     console.log("iFRAME ", frame);
        // }, d);

        // await playerPage.runFunctions('play');

        // const isMuted = await playerPage.getPlayerAttribute('muted');
        // expect(isAutoPlay).toBeTruthy();
        // console.log("isMuted? ", isMuted);
        // await playerPage.listenPlayerEvent('attached');


        // await playerPage.page.waitForTimeout(3_000);

        // const dimensions = playerPage.getContainerDimensions();
        // ba-commoncss-icon-volume-off // ba-commoncss-icon-volume-up

        // await playerPage.page.screenshot({ path: screenShotTitle });
    });
});

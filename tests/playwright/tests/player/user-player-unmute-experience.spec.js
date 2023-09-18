import { test, expect, chromium } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    CHROME_CANARY_LOCATION, defaultPlayerAttributes, AD_TAG_URL
} from "../../consts.js";

// Will test the player with autoplay and unmute on click
test.describe('Chrome: Testing Player With AutoPlay on unmute on click', () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: AD_TAG_URL,
    }
    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: false, // If headless is true, player will start with user interaction
        devtools: true,
        executablePath: CHROME_CANARY_LOCATION,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        retries: 0,
        timeout: 20_000,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    // test.beforeEach(async ({ page }) => {});

    test(`Ads Player on autoplay with user experience`, async (
        { page, browserName, context }, testInfo
    ) => {
        const screenShotTitle = `./tests/playwright/screenshots/${(testInfo.title.replaceAll(' ', '-')).slice(0, 20)}-${browserName}.png`;

        await (async () => {
            // const browser = await firefox.launch();
            // because of video codec trouble with chromium, we're using below approach
            const browser = await chromium.launch(browserSettings);
            const page = await browser.newPage();
            // delete defaultPlayerAttributes['poster'];
            const player = new PlayerPage(page, Object.assign({}, defaultPlayerAttributes,
                defaultPlayerAttributes
            ), [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const hasAdsSource = await player.getAdsPlayerAttribute(`adshassource`);
            expect(hasAdsSource).not.toBeUndefined();

            if (hasAdsSource) {
                await player.adExperienceFlow(true, true);
            } else {
                throw new Error(`We need ad tag URL to proceed`);
            }
            await browser.close();
        })();

        await playerPage.page.screenshot({ path: screenShotTitle });
    });

    test(`Video Content Player on autoplay with user experience`, async () => {
        await (async () => {
            // const browser = await firefox.launch();
            const browser = await chromium.launch(browserSettings);
            const page = await browser.newPage();
            delete descriptionPlayerAttributes["adtagurl"];
            const player = new PlayerPage(page, Object.assign({}, defaultPlayerAttributes, descriptionPlayerAttributes), [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.contentVideoExperienceFlow();

            await browser.close();
        })();
    });
});

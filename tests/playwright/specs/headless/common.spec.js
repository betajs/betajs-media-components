import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import { defaultPlayerAttributes, AD_TAG_URL, } from "../../consts.js";
import runTestMethod from '../../utils/run-test';


// Will test the player with autoplay and unmute on click
test.describe(`Fundamental attributes`, () => {

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: true, // If headless is true, player will start with user interaction
        devtools: !process.env?.CI,
    }

    test.describe.configure({
        headless: true,
        mode: 'default',
        retries: 0,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`default state`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const player = new PlayerPage(page,
                defaultPlayerAttributes, context, [{ blk: 0 }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playerButton = await player.getElementByTestID(`overlay-play-button`);
            await expect(playerButton).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`skip initial state`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const player = new PlayerPage(page,
                { ...defaultPlayerAttributes, skipinitial: true }, context, [{ blk: 0 }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playerButton = await player.getElementByTestID(`content-play-button`);
            await expect(playerButton).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

});

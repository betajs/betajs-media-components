import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';


// Will test the player with autoplay and unmute on click
test.describe(`Preroll ads autoplay`, () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        muted: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: AD_TAG_URL,
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: false, // If headless is true, player will start with user interaction
        devtools: !process.env?.CI,
    }

    test.describe.configure({
        headless: true,
        mode: 'default',
        retries: 0,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`should load but not start while ads is out of view`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const adsContainer = await player.getElementByTestID(`ads-player-container`);

            const adsStarted = Promise.race([
                player.listenPlayerEvent(`ads:load`, 0)
                    .then(() => true),
                player.listenPlayerEvent(`attached`, 0)
                    .then(() => false),
            ]).catch(() => {
                throw "Missing content playing or ads container";
            });

            await adsStarted.then(async (adsVisible) => {
                if (adsVisible) {
                    // Wait ads container to be visible
                    await expect(adsContainer).toBeInViewport(); //.toBeVisible() || .toBeInViewport();
                    await adsContainer.hover();

                    const adsLoaded = await player.listenPlayerEvent(`ads:loaded`);
                    await expect(adsLoaded).toBeTruthy();

                    await page.delay(500);

                    // const adsPlaying = await player.listenPlayerEvent(`ads:play`);
                    const adsPlaying = await player.getPlayerAttribute(`adsplaying`);
                    await expect(adsPlaying).toBeFalsy();
                } else {
                    await expect.soft(adsVisible, `Wil be better to see ads on test, but it's not critical`).toBeTruthy();
                }

                await browser.close();
            });
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`Preroll ads play on user click`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const adsRenderTimeout = 0;
            descriptionPlayerAttributes.adtagurl = ERROR_TAG_URL;
            descriptionPlayerAttributes.adsrendertimeout = adsRenderTimeout;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes
                }, context, [{
                    blk: 1
                }]
            );

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

        }

        await runTestMethod({page, browserName, browser, context}, runAdsTester, browserSettings);
    });
});

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
        muted: true,
        unmuteonclick: true,
        width: 640, height: 360,
        adtagurl: AD_TAG_URL,
    }

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

    test(`preload ads, manual play`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        autoplay: false,
                        skipinitial: false,
                        preload_ads: true,
                        autoplaywhenvisible: false,
                    }
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.listenPlayerEvent(`ads:loaded`, 2000);

            const adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            const playerButton = await player.getElementByTestID(`overlay-play-button`);
            await expect(playerButton).toBeVisible();

            await playerButton.click();

            const adsContainer = await player.getElementByTestID(`ads-player-container`);
            await expect(adsContainer).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`preload ads, skipinitial, manual play`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        autoplay: false,
                        skipinitial: true,
                        preload_ads: true,
                        autoplaywhenvisible: false,
                    }
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.listenPlayerEvent(`ads:loaded`, 2000);
            const adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            const playerButton = await player.getElementByTestID(`content-play-button`);
            await expect(playerButton).toBeVisible();

            await playerButton.click();

            const adsContainer = await player.getElementByTestID(`ads-player-container`);
            await expect(adsContainer).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`preload ads, auto play`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        autoplay: true,
                        skipinitial: false,
                        preload_ads: true,
                        autoplaywhenvisible: false,
                    }
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.listenPlayerEvent(`ads:loaded`, 2000);

            const adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            const adsContainer = await player.getElementByTestID(`ads-player-container`);
            await expect(adsContainer).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`preload ads, playwhenvisible`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        autoplay: false,
                        skipinitial: false,
                        preload_ads: true,
                        autoplaywhenvisible: true,
                    }
                }, context, [{
                    blk: 1
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.listenPlayerEvent(`ads:loaded`, 2000);

            const adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            const adsContainer = await player.getElementByTestID(`ads-player-container`);
            await expect(adsContainer).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

});

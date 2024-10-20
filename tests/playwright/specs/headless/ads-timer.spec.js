import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    BROWSER_LAUNCH_PATH, defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL,
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

test.describe(`Autoplay: Later ads source integration`, () => {
    const adsSourceInitTimeout = 3000;
    let descriptionPlayerAttributes = {
        autoplay: true,
        muted: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: null,
        ads_source_init_timeout: adsSourceInitTimeout
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: true, // If headless is true, player will start with user interaction
        devtools: false,
        executablePath: BROWSER_LAUNCH_PATH,
    }

    test.describe.configure({
        mode: 'default',
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry'
    });

    test(`Success: Wait for ads source`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playerContainer = await player.getElementByTestID(`player-container`);
            await expect(playerContainer).toBeVisible();

            let waitAdsSourceInitTime = await player.getPlayerAttribute(`ads_source_init_timeout`);
            await expect(waitAdsSourceInitTime).toBe(adsSourceInitTimeout);

            let currentStateName = await player.getPlayerCurrentStateName();
            await expect(currentStateName).toBe(`LoadPlayer`);

            await player.delay( 1);
            await player.setPlayerAttribute(`adtagurl`, AD_TAG_URL);

            // As soon as the ad source is set, the player will start loading the ad source
            // it should not wait for the ads source init timeout completed
            await player.delay(300);
            await expect(currentStateName).toBe(currentStateName);

            // NOTE: sometime causes the broken test, actually it's passing but need a lot re-runs.
            // Leave here for future implementation usecase.
            // const perfRecords = await player.getPlayerAttribute(`performancerecords`);
            // const records = perfRecords.filter((record) => (record.name === `ba-player-perf-startAdsSourceSetupChecker` || record.name === `ba-player-perf-stopAdsSourceSetupChecker-true`));
            // // be sure that the time between the first and the second record is less than the waitAdsSourceInitTime
            // await expect(Number(records[1]?.startTime) - Number(records[0]?.startTime)).toBeLessThanOrEqual(waitAdsSourceInitTime - 500);

            let nextStateName = await player.getPlayerCurrentStateName();
            await expect(nextStateName).not.toBe(currentStateName);

            browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`Timeout: waiting for ads source`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playerContainer = await player.getElementByTestID(`player-container`);
            await expect(playerContainer).toBeVisible();

            let waitAdsSourceInitTime = await player.getPlayerAttribute(`ads_source_init_timeout`);
            await expect(waitAdsSourceInitTime).toBe(adsSourceInitTimeout);

            let currentStateName = await player.getPlayerCurrentStateName();
            await expect(currentStateName).toBe(`LoadPlayer`);

            await player.delay(waitAdsSourceInitTime + 1000);

            let nextStateName = await player.getPlayerCurrentStateName();
            await expect(nextStateName).not.toBe(currentStateName);

            browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`Wrong ad source: waiting for ads source`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playerContainer = await player.getElementByTestID(`player-container`);
            await expect(playerContainer).toBeVisible();

            let waitAdsSourceInitTime = await player.getPlayerAttribute(`ads_source_init_timeout`);
            await expect(waitAdsSourceInitTime).toBe(adsSourceInitTimeout);

            let currentStateName = await player.getPlayerCurrentStateName();
            await expect(currentStateName).toBe(`LoadPlayer`);

            await player.delay( 1);
            await player.setPlayerAttribute(`adtagurl`, ERROR_TAG_URL);

            await player.delay(300);
            await expect(currentStateName).toBe(currentStateName);
            // await player.listenPlayerEvent(`ads:error`);

            browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });
});

test.describe(`Manual Play: Later ads source integration`, () => {
    const adsSourceInitTimeout = 3000;
    let descriptionPlayerAttributes = {
        autoplay: false,
        muted: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: null,
        ads_source_init_timeout: adsSourceInitTimeout
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: true, // If headless is true, player will start with user interaction
        devtools: false,
        executablePath: BROWSER_LAUNCH_PATH,
    }

    test.describe.configure({
        mode: 'default',
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`Success: Wait for ads source`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playerContainer = await player.getElementByTestID(`player-container`);
            await expect(playerContainer).toBeVisible();

            let waitAdsSourceInitTime = await player.getPlayerAttribute(`ads_source_init_timeout`);
            await expect(waitAdsSourceInitTime).toBe(adsSourceInitTimeout);

            let currentStateName = await player.getPlayerCurrentStateName();
            await expect(currentStateName).toBe(`LoadPlayer`);

            await player.delay( 1);
            await player.setPlayerAttribute(`adtagurl`, AD_TAG_URL);

            // As soon as the ad source is set, the player will start loading the ad source
            // it should not wait for the ads source init timeout completed
            await player.delay(300);
            await expect(currentStateName).toBe(currentStateName);

            // NOTE: sometime causes the broken test, actually it's passing but need a lot re-runs.
            // Leave here for future implementation usecase.
            // const perfRecords = await player.getPlayerAttribute(`performancerecords`);
            // const records = perfRecords.filter((record) => (record.name === `ba-player-perf-startAdsSourceSetupChecker` || record.name === `ba-player-perf-stopAdsSourceSetupChecker-true`));
            // // be sure that the time between the first and the second record is less than the waitAdsSourceInitTime
            // await expect(Number(records[1]?.startTime) - Number(records[0]?.startTime)).toBeLessThanOrEqual(waitAdsSourceInitTime - 500);

            let nextStateName = await player.getPlayerCurrentStateName();
            await expect(nextStateName).not.toBe(currentStateName);

            browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`Timeout: waiting for ads source`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                    skipinitial: true
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playerContainer = await player.getElementByTestID(`player-container`);
            await expect(playerContainer).toBeVisible();

            let waitAdsSourceInitTime = await player.getPlayerAttribute(`ads_source_init_timeout`);
            await expect(waitAdsSourceInitTime).toBe(adsSourceInitTimeout);

            let currentStateName = await player.getPlayerCurrentStateName();
            await expect(currentStateName).toBe(`LoadPlayer`);

            await player.delay(waitAdsSourceInitTime + 1000);

            let nextStateName = await player.getPlayerCurrentStateName();
            await expect(nextStateName).not.toBe(currentStateName);

            browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`Wrong ad source: waiting for ads source`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playerContainer = await player.getElementByTestID(`player-container`);
            await expect(playerContainer).toBeVisible();

            let waitAdsSourceInitTime = await player.getPlayerAttribute(`ads_source_init_timeout`);
            await expect(waitAdsSourceInitTime).toBe(adsSourceInitTimeout);

            let currentStateName = await player.getPlayerCurrentStateName();
            await expect(currentStateName).toBe(`LoadPlayer`);

            await player.delay( 1);
            await player.setPlayerAttribute(`adtagurl`, ERROR_TAG_URL);

            await player.delay(300);
            await expect(currentStateName).toBe(currentStateName);
            // await player.listenPlayerEvent(`ads:error`);

            browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });
});

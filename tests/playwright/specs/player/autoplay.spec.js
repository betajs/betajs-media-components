import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    defaultPlayerAttributes, AD_TAG_URL, ERROR_TAG_URL
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

const browserSettings = {
    // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
    headless: false, // If headless is true, player will start with user interaction
    devtools: !process.env?.CI,
}

test.describe(`No ads`, () => {
    const describeAttributes = {
        adtagurl: null,
        autoplay: true,
        showsidebargallery: true,
    }

    test.describe.configure({
        headless: browserSettings.headless,
        mode: 'default',
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`autoplay on out of view`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        autoplay: true
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            // When ads starts playing, IMA SDK will bring player to the view port
            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).toBeVisible();
            await expect(wrapperElement).not.toBeInViewport();

            await player.listenPlayerEvent(`change:position`);
            await player.waitNextSecondPosition(3);
            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            const pauseButton = await player.getElementByTestID(`content-pause-button`);
            await expect(pauseButton).toBeVisible();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`autoplay when visible`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        autoplay: true,
                        autoplaywhenvisible: true
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            // When ads starts playing, IMA SDK will bring player to the view port
            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).toBeVisible();
            await expect(wrapperElement).not.toBeInViewport();

            await player.delay(2);
            let playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeFalsy();

            await player.scrollToTheElement(wrapperElement);
            await player.waitNextSecondPosition(2);
            playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            const pauseButton = await player.getElementByTestID(`content-pause-button`);
            await expect(pauseButton).toBeVisible();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });
});

// Will test the player with autoplay and unmute on click
test.describe(`With ads`, () => {
    const describeAttributes = {
        adtagurl: AD_TAG_URL,
        autoplay: true,
        showsidebargallery: true,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`autoplay when visible on scroll with sidebar`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        autoplay: false,
                        skipinitial: false,
                        autoplaywhenvisible: true,
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await player.scrollToTheElement(wrapperElement);
            await expect(wrapperElement).toBeInViewport();

            await player.listenPlayerEvent(`ads:firstQuartile`, 20);
            // as soon as ads starts ads_loaded becomes falsy till next loaded ad
            let adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

            await player.clickAdsSkipButton();
            await player.listenPlayerEvent(`ads:complete`, 20);

            await player.listenPlayerEvent(`change:position`);
            await player.waitNextSecondPosition(3);
            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`autoplay on out of view`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        autoplay: true,
                        skipinitial: false,
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const adsCompletedEvent = player.listenPlayerEvent(`ads:complete`, 20);
            const adsLoaded = async () => player.getPlayerAttribute(`ads_loaded`);

            await player.listenPlayerEvent(`ads:loaded`, 20);

            // When ads starts playing, IMA SDK will bring player to the view port
            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).toBeInViewport();

            await player.listenPlayerEvent(`ads:start`, 20);
            await player.waitAdsRemainingSeconds(8);
            let adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeTruthy();
            await expect(await adsLoaded()).toBeFalsy();

            let adsPauseButton = await player.getElementByTestID(`ads-controlbar-pause-button`);
            await expect(adsPauseButton).toBeInViewport();

            await player.clickAdsSkipButton();
            await adsCompletedEvent;

            await player.waitNextSecondPosition(3);
            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`outstream ads, scroll and play when visible`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        autoplay: true,
                        preload_ads: true,
                        outstream: true
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const adsContainer = player.getElementByTestID(`ads-player-container`);
            await expect(await adsContainer).toBeVisible();
            await player.scrollToTheElement(await adsContainer);

            await player.listenPlayerEvent(`ads:firstQuartile`, 30);
            const adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

            await (await adsContainer).hover();
            let adsPauseButton = await player.getElementByTestID(`ads-controlbar-pause-button`);
            await expect(adsPauseButton).toBeVisible();

            const adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeTruthy();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });
});

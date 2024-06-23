import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

// Will test the player with autoplay and unmute on click
test.describe(`Preload ads, with ads source`, () => {
    const describeAttributes = {
        adtagurl: AD_TAG_URL,
        autoplay: true,
        showsidebargallery: true,
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: false, // If headless is true, player will start with user interaction
        devtools: !process.env?.CI,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        retries: 0,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`preload ads, autoplay when visible on scroll with sidebar`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        autoplay: false,
                        skipinitial: false,
                        preload_ads: true,
                        autoplaywhenvisible: true,
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.listenPlayerEvent(`ads:loaded`, 2000);
            let adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await player.scrollToTheElement(wrapperElement);
            await expect(wrapperElement).toBeInViewport();

            const sidebarElement = await player.getElementByTestID(`player-sidebar`);
            console.log(`sidebar: `, sidebarElement);
            await expect(sidebarElement).toBeInViewport();

            await player.listenPlayerEvent(`ads:firstQuartile`, 2000);
            // as soon as ads starts ads_loaded becomes falsy till next loaded ad
            adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

            await player.clickAdsSkipButton();
            await player.listenPlayerEvent(`ads:complete`, 2000);

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

    test(`preload ads, with autoplay`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...{
                        adtagurl: AD_TAG_URL,
                        autoplay: true,
                        skipinitial: false,
                        preload_ads: true,
                        autoplaywhenvisible: false
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.listenPlayerEvent(`ads:loaded`, 2000);

            //  as soon ads loads, IMA will move player container to the viewport
            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).toBeInViewport();

            await player.listenPlayerEvent(`ads:start`);
            let adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

            let adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeTruthy();

            let adsPauseButton = await player.getElementByTestID(`ads-controlbar-pause-button`);
            await expect(adsPauseButton).toBeInViewport();

            await player.clickAdsSkipButton();
            await player.listenPlayerEvent(`ads:complete`, 1000);

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

    test(`preload ads, auto play even not visible`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...{
                        adtagurl: AD_TAG_URL,
                        autoplay: true,
                        skipinitial: false,
                        preload_ads: true,
                        autoplaywhenvisible: false,
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();
            await player.listenPlayerEvent(`ads:loaded`, 2000);

            let adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            let adsPauseButton = await player.getElementByTestID(`ads-controlbar-pause-button`);
            await expect(adsPauseButton).toBeInViewport();
            let adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeTruthy();

            adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`Autoplay player content`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    autoplay: true,
                }, context,
                [{ blk: 2 }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            const pauseButton = await player.getElementByTestID(`content-pause-button`);
            await expect(pauseButton).toBeVisible();
            await expect(pauseButton).not.toBeInViewport();
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
                    ...{
                        adtagurl: AD_TAG_URL,
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

            const adsContainer = await player.getElementByTestID(`ads-player-container`);
            await expect(adsContainer).toBeVisible();
            await player.scrollToTheElement(adsContainer);

            await player.listenPlayerEvent(`ads:firstQuartile`, 3000);
            const adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

            adsContainer.hover();
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


test.describe(`Preload ads without ad source`, () => {
    const describeAttributes = {
        autoplay: true,
        showsidebargallery: true,
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: false, // If headless is true, player will start with user interaction
        devtools: !process.env?.CI,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        retries: 0,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`preload ads, scroll to start autoplay`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        autoplay: false,
                        skipinitial: false,
                        preload_ads: true,
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

            let playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeFalsy();

            await player.delay(4);

            await player.scrollToTheElement(wrapperElement);
            await expect(wrapperElement).toBeInViewport();

            await player.listenPlayerEvent(`change:position`);
            await player.waitNextSecondPosition(2);
            playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`preload ads, autoplay on out of viewport`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...{
                        autoplay: true,
                        skipinitial: false,
                        preload_ads: true,
                        autoplaywhenvisible: false
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();


            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await player.delay(2);

            const isAttached = await player.runMethod(`videoAttached`);
            await expect(isAttached).toBeTruthy();

            let allowAutoplay = await player.getPlayerAttribute(`autoplay-allowed`);
            if (allowAutoplay) {
                await player.listenPlayerEvent(`change:position`);
                await player.waitNextSecondPosition(3);
            } else {
                await player.scrollToTheElement(wrapperElement);
                await expect(wrapperElement).toBeInViewport();
                await wrapperElement.hover();
                const playerButton = await player.getElementByTestID(`content-play-button`);
                await expect(playerButton).toBeVisible();
                await playerButton.click();
                await player.waitNextSecondPosition(3);
            }

            let pauseButton = await player.getElementByTestID(`content-pause-button`);
            await expect(pauseButton).toBeVisible();

            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });
});

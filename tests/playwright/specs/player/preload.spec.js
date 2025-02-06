import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import { defaultPlayerAttributes, AD_TAG_URL } from "../../consts.js";
import runTestMethod from '../../utils/run-test';

// Will test with ads
test.describe(`With ads source`, () => {
    const playerWidth = 640;
    const describeAttributes = {
        adtagurl: AD_TAG_URL,
        showsidebargallery: true,
        width: playerWidth
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: false, // If headless is true, player will start with user interaction
        devtools: !process.env?.CI,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`manual play, preload ads`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        preload_ads: true
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const overlayPlayButton = player.getElementByTestID(`overlay-play-button`);
            const adsPlayButton = player.getElementByTestID(`ads-controlbar-play-button`);
            const adsPauseButton = player.getElementByTestID(`ads-controlbar-pause-button`);
            const pauseButton = player.getElementByTestID(`content-pause-button`);

            const adsLoadedEvent = player.listenPlayerEvent(`ads:loaded`, 20);
            const adsStartEvent = player.listenPlayerEvent(`ads:start`, 20);
            const adsCompletedEvent = player.listenPlayerEvent(`ads:allAdsCompleted`, 20);

            const adsLoadedAttr = async () =>  player.getPlayerAttribute(`ads_loaded`);
            const isPlaying = async () => player.getPlayerAttribute(`playing`);

            // await expect(await player.getPlayerCurrentStateName()).toEqual(`LoadAds`);
            await adsLoadedEvent;
            await expect(await adsLoadedAttr()).toBeTruthy();

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await player.scrollToTheElement(wrapperElement);
            await expect(wrapperElement).toBeInViewport();

            await expect(await overlayPlayButton).toBeVisible();
            await (await overlayPlayButton).click();

            await adsStartEvent;

            // as soon as ads starts ads_loaded becomes falsy till next loaded ad
            await expect(await adsLoadedAttr()).toBeFalsy();

            await expect(await adsPauseButton).toBeVisible();
            await (await adsPauseButton).click();
            await expect(await adsPlayButton).toBeVisible();
            await (await adsPlayButton).click();

            await player.clickAdsSkipButton();
            await adsCompletedEvent;

            await expect(await pauseButton).toBeVisible();
            await player.waitNextSecondPosition(3);
            await expect(await isPlaying).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
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

            await player.listenPlayerEvent(`ads:loaded`, 20);
            let adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await player.scrollToTheElement(wrapperElement);
            await expect(wrapperElement).toBeInViewport();

            const sidebarElement = await player.getElementByTestID(`player-sidebar`);
            await expect(sidebarElement).toBeInViewport();

            await player.listenPlayerEvent(`ads:firstQuartile`, 20);
            // as soon as ads starts ads_loaded becomes falsy till next loaded ad
            adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

            await player.clickAdsSkipButton();

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
                        width: 640, height: 360,
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


            //  as soon ads loads, IMA will move player container to the viewport
            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();
            const waitAdsStartEvent = async () => player.listenPlayerEvent(`ads:start`, 25);

            await page.mouse.wheel(0, 600);

            await waitAdsStartEvent()
            await player.waitAdsRemainingSeconds(8);
            let adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeTruthy();

            let adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

            let adsPauseButton = await player.getElementByTestID(`ads-controlbar-pause-button`);
            await expect(adsPauseButton).toBeInViewport();

            await player.clickAdsSkipButton();

            await player.waitNextSecondPosition(3);
            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            await browser.close();
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

            const secondContainerHeader = await page.getByTestId(`h2-header`);
            await player.scrollToTheElement(secondContainerHeader, -150);

            const adsContainer = await player.getElementByTestID(`ads-player-container`);
            await player.scrollToTheElement(await adsContainer);

            await player.listenPlayerEvent(`ads:firstQuartile`, 30);
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

// Will test without ads
test.describe(`With no ads`, () => {
    const describeAttributes = {
        adtagurl: null,
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
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`manual play, preload ads`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        preload_ads: true
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const overlayPlayButton = player.getElementByTestID(`overlay-play-button`);
            const pauseButton = player.getElementByTestID(`content-pause-button`);

            const adsLoadedAttr = async () =>  player.getPlayerAttribute(`ads_loaded`);
            const isPlaying = async () => player.getPlayerAttribute(`playing`);

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await player.scrollToTheElement(wrapperElement);
            await expect(wrapperElement).toBeInViewport();
            await expect(await adsLoadedAttr()).toBeUndefined();

            await expect(await overlayPlayButton).toBeVisible();
            await (await overlayPlayButton).click();

            // as soon as ads starts ads_loaded becomes falsy till next loaded ad
            await expect(await adsLoadedAttr()).toBeFalsy();

            await expect(await pauseButton).toBeVisible();
            await player.waitNextSecondPosition(3);
            await expect(await isPlaying).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`manual play, preload video and preload ads`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttributes,
                    ...{
                        preload: true,
                        preload_ads: true
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const overlayPlayButton = player.getElementByTestID(`overlay-play-button`);
            const pauseButton = player.getElementByTestID(`content-pause-button`);

            const videoProperty = async () => player.getPropertyValue(`__video`);
            const adsLoadedAttr = async () =>  player.getPlayerAttribute(`ads_loaded`);
            const isPlaying = async () => player.getPlayerAttribute(`playing`);

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await expect(await videoProperty()).toBeDefined();

            await player.scrollToTheElement(wrapperElement);
            await expect(wrapperElement).toBeInViewport();
            await expect(await adsLoadedAttr()).toBeUndefined();

            await expect(await overlayPlayButton).toBeVisible();
            await (await overlayPlayButton).click();

            // as soon as ads starts ads_loaded becomes falsy till next loaded ad
            await expect(await adsLoadedAttr()).toBeFalsy();

            await expect(await pauseButton).toBeVisible();
            await player.waitNextSecondPosition(3);
            await expect(await isPlaying).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
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
                        autoplaywhenvisible: true
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
                //await player.waitNextSecondPosition(3);
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
            await expect(pauseButton).not.toBeVisible();

            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeFalsy();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });
});

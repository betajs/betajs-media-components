import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

const browserSettings = {
    // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
    headless: false, // If headless is true, player will start with user interaction
    devtools: !process.env?.CI,
}

// Will test the player with autoplay and unmute on click
test.describe(`With Ads`, () => {
    const playerWidth = 480;
    const describeAttrs = {
        adtagurl: AD_TAG_URL,
        width: playerWidth,
    }

    test.describe.configure({
        headless: browserSettings.headless,
        mode: 'default',
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`scroll and play on click`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttrs
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const overlayPlayButton = player.getElementByTestID(`overlay-play-button`);
            const wrapperElement = player.getElementByTestID(`player-container`);
            const adsPauseButton = player.getElementByTestID(`ads-controlbar-pause-button`);
            const adsPlayButton = player.getElementByTestID(`ads-controlbar-play-button`);
            const pauseButton = player.getElementByTestID(`content-pause-button`);

            await expect(await wrapperElement).not.toBeInViewport();

            await player.scrollToTheElement(await wrapperElement);
            await expect(await wrapperElement).toBeInViewport();

            await expect(await overlayPlayButton).toBeVisible();
            await (await overlayPlayButton).click();

            await player.listenPlayerEvent(`ads:loaded`, 2000);

            let adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            await player.listenPlayerEvent(`ads:firstQuartile`, 2000);
            let adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeTruthy();
            adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeFalsy();

            await expect(await adsPauseButton).toBeVisible();
            await (await adsPauseButton).click();
            await expect(await adsPlayButton).toBeVisible();
            await (await adsPlayButton).click();

            const waitForSkip =  player.listenPlayerEvent(`ads:skip`, 2000);
            await player.clickAdsSkipButton();
            await waitForSkip;

            adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeFalsy();

            await player.waitNextSecondPosition(2);
            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            await (await wrapperElement).hover();
            await expect(await pauseButton).toBeVisible();
            await (await pauseButton).click();
            await expect(await pauseButton).not.toBeVisible();
            const playButton = await player.getElementByTestID(`content-play-button`);
            await expect(playButton).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`skip initial`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttrs,
                    skipinitial: true,
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const playButton = player.getElementByTestID(`content-play-button`);
            const pauseButton = player.getElementByTestID(`content-pause-button`);
            const contentPlaying = async () => player.getPlayerAttribute(`playing`);

            const adsPlayButton = player.getElementByTestID(`ads-controlbar-play-button`);
            const adsPauseButton = player.getElementByTestID(`ads-controlbar-pause-button`);
            const adsPlaying = async () => player.getAdsPlayerAttribute(`adsplaying`);
            const adsStartedEvent =  async () => player.listenPlayerEvent(`ads:start`, 2000);

            const wrapperElement = player.getElementByTestID(`player-container`);
            await expect(await wrapperElement).toBeInViewport();
            await expect(await adsPlaying()).toBeFalsy();
            await expect(await playButton).toBeInViewport();
            await expect(await adsPauseButton).not.toBeVisible();
            await (await playButton).click();
            await adsStartedEvent();

            await (await wrapperElement).hover();
            await expect(await adsPauseButton).toBeVisible();
            await (await adsPauseButton).click();
            await expect(await adsPlayButton).toBeVisible();
            await (await adsPlayButton).click();

            await player.clickAdsSkipButton();

            await player.waitNextSecondPosition(2);
            await expect(await contentPlaying()).toBeTruthy();
            await expect(await pauseButton).toBeVisible();
            await (await pauseButton).click();
            await expect(await playButton).toBeVisible();

            browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });
});

test.describe(`No Ads`, () => {
    const describeAttrs = {
        adtagurl: null,
        autoplay: false,
        autoplaywhenvisible: false,
    }

    test.describe.configure({
        mode: 'default',
        headless: browserSettings.headless,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`scroll and play on click`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttrs
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await player.scrollToTheElement(wrapperElement);

            const overlayPlayButton = await player.getElementByTestID(`overlay-play-button`);
            await expect(overlayPlayButton).toBeVisible();
            overlayPlayButton.click();

            let pauseButton = await player.getElementByTestID(`content-pause-button`);
            await expect(pauseButton).toBeVisible();

            await player.waitNextSecondPosition(2);

            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            const playButton = await player.getElementByTestID(`content-play-button`);
            await pauseButton.click();
            await expect(playButton).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`skip initial`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttrs,
                    skipinitial: true,
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).toBeInViewport();

            await player.scrollToTheElement(wrapperElement);

            let playButton = await player.getElementByTestID(`content-play-button`);
            await expect(playButton).toBeVisible();
            playButton.click();

            let pauseButton = await player.getElementByTestID(`content-pause-button`);
            await expect(pauseButton).toBeVisible();

            await player.waitNextSecondPosition(2);

            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();

            await pauseButton.click();
            await expect(playButton).toBeVisible();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);

    });
});

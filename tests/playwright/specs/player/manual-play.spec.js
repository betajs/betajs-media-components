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
    const describeAttrs = {
        adtagurl: AD_TAG_URL,
        autoplay: false,
        autoplaywhenvisible: false,
    }

    test.describe.configure({
        headless: browserSettings.headless,
        mode: 'default',
        retries: 2,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`preload ads, scroll and play on click`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...describeAttrs,
                    ...{
                        preload_ads: true,
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
            await expect(adsPauseButton).not.toBeVisible();

            const wrapperElement = await player.getElementByTestID(`player-container`);
            await expect(wrapperElement).not.toBeInViewport();

            await player.scrollToTheElement(null, 50 ,1);
            let position = await player.getAdsPlayerAttribute(`position`);
            await expect(position).toBeUndefined();
            let adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeFalsy();
            await expect(adsPauseButton).not.toBeVisible();

            await player.scrollToTheElement(wrapperElement, null, 5);

            adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
            await expect(adsLoaded).toBeTruthy();

            const playerContainer = await player.getElementByTestID(`player-container`);
            await expect(playerContainer).toBeVisible();
            const overlayPlayButton = await player.getElementByTestID(`overlay-play-button`);
            await expect(overlayPlayButton).toBeVisible();
            overlayPlayButton.click();

            await player.listenPlayerEvent(`ads:firstQuartile`, 2000);
            adsPlaying = await player.getAdsPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeTruthy();
            adsPauseButton = await player.getElementByTestID(`ads-controlbar-pause-button`);
            await expect(adsPauseButton).toBeVisible();

            await player.clickAdsSkipButton();
            await player.listenPlayerEvent(`ads:complete`, 2000);

            await player.listenPlayerEvent(`playing`, 2000);
            const playing = await player.getPlayerAttribute(`playing`);
            await expect(playing).toBeTruthy();
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
        retries: 0,
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
});

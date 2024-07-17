import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

const browserSettings = {
    // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
    headless: true, // If headless is true, player will start with user interaction
    devtools: !process.env?.CI,
}

let commonPlayerAttributes = {
    preload: true,
    muted: true,
    unmuteonclick: true,
    width: 640, height: 360,
    adtagurl: AD_TAG_URL,
}

test(`preload video content`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        const player = new PlayerPage(page,
            {
                ...defaultPlayerAttributes,
                ...commonPlayerAttributes, ...{
                    adtagurl: null,
                    preload_ads: false,
                },
            }, context, [{
                blk: 2
            }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        const stateRegex = new RegExp(`(PosterReady)|(LoadPlayer)`);
        await expect(await player.getPlayerCurrentStateName()).toMatch(stateRegex);
        // It's confirmed that video is attached
        const videoProperty = await player.getPropertyValue(`__video`);
        await expect(videoProperty).toBeDefined();

        const playButton = await player.getElementByTestID(`overlay-play-button`);
        await expect(playButton).toBeVisible();
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

test(`preload ads`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        const player = new PlayerPage(page,
            {
                ...defaultPlayerAttributes,
                ...commonPlayerAttributes,
            }, context, [{
                blk: 0
            }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        await player.listenPlayerEvent(`ads:loaded`, 10);

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
                ...commonPlayerAttributes,
                ...{
                    skipinitial: true,
                }
            }, context, [{
                blk: 0
            }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        await player.listenPlayerEvent(`ads:loaded`, 10);
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
        const player = new PlayerPage(page,
            {
                ...defaultPlayerAttributes,
                ...commonPlayerAttributes,
                ...{
                    autoplay: true
                }
            }, context, [{
                blk: 0
            }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        await player.listenPlayerEvent(`ads:loaded`, 10);

        const adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
        await expect(adsLoaded).toBeTruthy();

        const adsContainer = await player.getElementByTestID(`ads-player-container`);
        await expect(adsContainer).toBeVisible();
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

test(`preload ads, playwhenvisible when player on view port`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        let adsPlaying;
        const player = new PlayerPage(page,
            {
                ...defaultPlayerAttributes,
                ...commonPlayerAttributes,
                ...{
                    autoplaywhenvisible: true,
                }
            }, context, [{
                blk: 1
            }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        await player.listenPlayerEvent(`ads:loaded`, 10);

        const adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
        await expect(adsLoaded).toBeTruthy();

        const adsContainer = await player.getElementByTestID(`ads-player-container`);
        await expect(adsContainer).toBeVisible();
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

test(`preload ads, scroll playwhenvisible when player on view port`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        let adsPlaying;
        const player = new PlayerPage(page,
            {
                ...defaultPlayerAttributes,
                ...commonPlayerAttributes,
                ...{
                    autoplaywhenvisible: true,
                }
            }, context, [{
                blk: 2
            }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        await player.listenPlayerEvent(`ads:loaded`, 10);

        let adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
        await expect(adsLoaded).toBeTruthy();

        const adsContainer = await player.getElementByTestID(`ads-player-container`);
        await expect(adsContainer).toBeVisible();
        await expect(adsContainer).not.toBeInViewport();

        await player.scrollToTheElement(adsContainer);
        await expect(adsContainer).toBeInViewport();

        // As soon as ads start to play, ads_loaded becomes false
        adsLoaded = await player.getPlayerAttribute(`ads_loaded`);
        await expect(adsLoaded).toBeFalsy();
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

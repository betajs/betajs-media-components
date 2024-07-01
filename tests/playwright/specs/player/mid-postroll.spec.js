import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    BROWSER_LAUNCH_PATH, defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL, VMAP_AD_TAG,
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

const browserSettings = {
    // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
    headless: false, // If headless is true, player will start with user interaction
    devtools: true,
    executablePath: BROWSER_LAUNCH_PATH,
}

// Will test the player with autoplay and unmute on click
test.describe(`VMAP`, () => {
    test.describe.configure({
        timeout: 90_000
    });

    let descriptionPlayerAttributes = {
        autoplay: true,
        nextwidget: false,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: VMAP_AD_TAG,
    }

    test(`Midroll-Post`, async ({ page, browserName, browser, context }) => {
        const testRunner = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        autoplay: true,
                    }
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const mouse = page.mouse;
            const waitAdsStartEvent = async () => player.listenPlayerEvent(`ads:start`, 25);
            const waitAdsContentResumeReqEvent = async () => player.listenPlayerEvent(`ads:contentResumeRequested`, 15);
            const waitPlayerEndedEvent = async () => player.listenPlayerEvent(`ended`, 15);
            const progressBar = player.getElementByTestID(`progress-bar-inner`);
            const playerContainer = player.getElementByTestID(`player-container`);

            await waitAdsStartEvent();
            await player.waitAdsRemainingSeconds(2);
            await waitAdsContentResumeReqEvent();

            await (await playerContainer).hover();
            await player.skipToPosition(0.90);

            // Midroll starts to load
            await waitAdsStartEvent();
            await player.waitAdsRemainingSeconds(1);
            await waitAdsContentResumeReqEvent();

            await waitPlayerEndedEvent();
            await waitAdsStartEvent();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, testRunner, browserSettings);
    });
});

// Will test the player with autoplay and unmute on click
test.describe(`Separate AdTags`, () => {
    test.describe.configure({
        timeout: 90_000
    });

    let descriptionPlayerAttributes = {
        autoplay: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: AD_TAG_URL,
    }

    test(`Midroll middle play`, async ({ page, browserName, browser, context }) => {
        const testRunner = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        nextwidget: false,
                        autoplay: true,
                        adsposition: "mid",
                    }
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const waitAdsStartEvent = async () => player.listenPlayerEvent(`ads:start`, 25);
            const progressBar = player.getElementByTestID(`progress-bar-inner`);

            await waitAdsStartEvent();
            await player.clickAdsSkipButton();

            await expect(await progressBar).toBeVisible();

            await player.skipToPosition(0.45)

            // Midroll starts to load
            await waitAdsStartEvent();
            await player.clickAdsSkipButton();
            await expect(await progressBar).toBeVisible();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, testRunner, browserSettings);
    });

    test(`Midroll each 10 sec play`, async ({ page, browserName, browser, context }) => {
        const testRunner = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        nextwidget: false,
                        autoplay: true,
                        adsposition: "mid[10*]",
                    }
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const waitAdsStartEvent = async (timeout) => player.listenPlayerEvent(`ads:start`, timeout || 25);
            const progressBar = player.getElementByTestID(`progress-bar-inner`);
            const position = async () => player.getPlayerAttribute(`position`);

            await waitAdsStartEvent();
            await player.clickAdsSkipButton();

            await player.waitNextSecondPosition(5);
            await waitAdsStartEvent();
            await player.clickAdsSkipButton();
            await expect(await progressBar).toBeInViewport();

            await player.waitNextSecondPosition(15);
            await waitAdsStartEvent();
            await player.clickAdsSkipButton();
            await expect(await progressBar).toBeInViewport();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, testRunner, browserSettings);
    });

    test(`Midroll passed 30% & 70% progress`, async ({ page, browserName, browser, context }) => {
        const testRunner = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        nextwidget: false,
                        autoplay: true,
                        adsposition: "mid[30%,70%]",
                    }
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const waitAdsStartEvent = async (timeout) => player.listenPlayerEvent(`ads:start`, timeout || 25);
            const progressBar = player.getElementByTestID(`progress-bar-inner`);

            await waitAdsStartEvent();
            await player.clickAdsSkipButton();

            await player.waitNextSecondPosition(1);

            await player.skipToPosition(0.28);
            await waitAdsStartEvent();
            await player.clickAdsSkipButton();
            await expect(await progressBar).toBeInViewport();

            await player.skipToPosition(0.60);
            await player.waitNextSecondPosition(15);
            await waitAdsStartEvent();
            await player.clickAdsSkipButton();
            await expect(await progressBar).toBeInViewport();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, testRunner, browserSettings);
    });

});

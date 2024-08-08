import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    BROWSER_LAUNCH_PATH, defaultPlayerAttributes, AD_TAG_URL, VMAP_AD_TAG,
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

            const waitAdsStartEvent = async () => player.listenPlayerEvent(`ads:start`, 25);
            const waitAdsContentResumeReqEvent = async () => player.listenPlayerEvent(`ads:contentResumeRequested`, 15);

            await waitAdsStartEvent();
            await waitAdsContentResumeReqEvent();

            
            // Midroll starts to load
            await waitAdsStartEvent();
            await waitAdsContentResumeReqEvent();

            // Postroll startds to load
            await player.skipToPosition(0.90);
            await player.runMethod('play')
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
        max_shortform_video_duration: 50,
        adtagurl: AD_TAG_URL,
    }

    test(`Short Video (< 1min) Should skip midroll ads`, async ({ page, browserName, browser, context }) => {
        const testRunner = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    width: 640, height: 360,
                    ...{
                        nextwidget: false,
                        autoplay: true,
                        adsposition: "mid",
                        max_shortform_video_duration: 60 // 1 min
                    }
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const waitAdsStartEvent = async () => player.listenPlayerEvent(`ads:start`, 25);

             // if content video is less than 10 min do not play midroll 
             await waitAdsStartEvent();
             await player.clickAdsSkipButton();
             await player.skipToPosition(0.05)
             const contentDuration = await player.getPlayerAttribute("duration")
             const shortVideoMaxLength = await player.getPlayerAttribute("max_shortform_video_duration")
             if (contentDuration < shortVideoMaxLength) {
                await player.skipToPosition(0.25)
                const adsContainer = page.locator(`.ba-adsplayer-linear-ad-container`);
                await waitAdsStartEvent().catch(() => {
                    expect(adsContainer).not.toBeVisible()
                });
             }

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, testRunner, browserSettings);
    });

    test(`Midroll middle play`, async ({ page, browserName, browser, context }) => {
        const testRunner = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    width: 640, height: 360,
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
            const progressBar = await player.getElementByTestID(`progress-bar-inner`);

            await waitAdsStartEvent();
            await player.clickAdsSkipButton();

            await expect(progressBar).toBeVisible();
            await player.skipToPosition(0.85)

            // Midroll starts to load
            await player.waitAdsRemainingSeconds(8, 20000);
            await player.clickAdsSkipButton();
            await expect(progressBar).toBeVisible();

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
                    ...descriptionPlayerAttributes,
                    ...defaultPlayerAttributes,
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
            const progressBar = await player.getElementByTestID(`progress-bar-inner`);

            await waitAdsStartEvent();
            await player.clickAdsSkipButton();

            await player.waitNextSecondPosition(5);

            await waitAdsStartEvent();
            await player.clickAdsSkipButton();
            await progressBar.hover()
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
                    ...descriptionPlayerAttributes,
                    ...defaultPlayerAttributes,
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
            const progressBar = await player.getElementByTestID(`progress-bar-inner`);

            
            await waitAdsStartEvent();
            await player.clickAdsSkipButton();

            await player.waitNextSecondPosition(1);

            await player.skipToPosition(0.28);
            await waitAdsStartEvent();
            await player.clickAdsSkipButton();
          
            await expect(progressBar).toBeInViewport();
            await player.skipToPosition(0.70);
            await player.waitNextSecondPosition(15);
            await waitAdsStartEvent();
            await player.clickAdsSkipButton();
            await expect(progressBar).toBeInViewport();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, testRunner, browserSettings);
    });

    test(`Skip to later progress bar position`, async ({ page, browserName, browser, context }) => {
        const testRunner = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...descriptionPlayerAttributes,
                    ...defaultPlayerAttributes,
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

            const waitAdsStartEvent = async (timeout) => player.listenPlayerEvent(`ads:start`, timeout || 25);
            const progressBar = player.getElementByTestID(`progress-bar-inner`);

            await player.waitAdsRemainingSeconds(9);
            await player.clickAdsSkipButton();

            await player.waitNextSecondPosition(2);

            await player.skipToPosition(0.75);
            await waitAdsStartEvent()
            await player.waitAdsRemainingSeconds(9);
            await player.clickAdsSkipButton();
            await expect(await progressBar).toBeInViewport();

            await browser.close();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, testRunner, browserSettings);
    });


});

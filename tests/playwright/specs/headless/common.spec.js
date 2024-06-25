import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import { defaultPlayerAttributes, AD_TAG_URL, } from "../../consts.js";
import runTestMethod from '../../utils/run-test';

const browserSettings = {
    // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
    headless: true, // If headless is true, player will start with user interaction
    devtools: !process.env?.CI,
}

test.describe.configure({
    mode: 'default',
    retries: 1,
    headless: browserSettings.headless,
    viewport: { width: 1280, height: 720 },
    video: 'on-first-retry',
});

test(`default state`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        let adsPlaying;
        const player = new PlayerPage(page,
            defaultPlayerAttributes, context, [{ blk: 0 }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        const playerButton = await player.getElementByTestID(`overlay-play-button`);

        const videoProperty = await player.getPropertyValue(`__video`);
        await expect(videoProperty).toBeUndefined();

        await expect(await playerButton).toBeVisible();
        await (await playerButton).click();
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

test(`skip initial state`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        let adsPlaying;
        const player = new PlayerPage(page,
            { ...defaultPlayerAttributes, skipinitial: true }, context, [{ blk: 0 }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        const playerButton = await player.getElementByTestID(`content-play-button`);
        await expect(playerButton).toBeVisible();

        await playerButton.click();
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

test(`in-article: default state`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        let adsPlaying;
        const player = new PlayerPage(page,
            defaultPlayerAttributes, context, [{ blk: 2 }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        const wrapperElement = await player.getElementByTestID(`player-container`);
        await expect(wrapperElement).toBeVisible();
        await expect(wrapperElement).not.toBeInViewport();

        await player.scrollToTheElement(wrapperElement);
        await expect(wrapperElement).toBeInViewport();

        const playerButton = await player.getElementByTestID(`overlay-play-button`);
        await expect(playerButton).toBeVisible();
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

test(`in-article: skip initial state`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        let adsPlaying;
        const player = new PlayerPage(page,
            { ...defaultPlayerAttributes, skipinitial: true }, context, [{
                blk: 2
            }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        const wrapperElement = await player.getElementByTestID(`player-container`);
        await expect(wrapperElement).toBeVisible();
        await expect(wrapperElement).not.toBeInViewport();

        await player.scrollToTheElement(wrapperElement);
        await expect(wrapperElement).toBeInViewport();

        const playerButton = await player.getElementByTestID(`content-play-button`);
        await expect(playerButton).toBeVisible();
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

test(`performance timing`, async ({ page, browserName, browser, context }) => {
    const runAdsTester = async (page, browser, context) => {
        let adsPlaying;
        const adsRenderTimeout = 600;
        const player = new PlayerPage(page,
            {
                ...defaultPlayerAttributes, ...{
                    autoplay: true,
                    muted: true,
                    unmuteonclick: true,
                    skipinitial: false,
                    width: 640, height: 360,
                    adtagurl: AD_TAG_URL,
                },
                adsrendertimeout: adsRenderTimeout
            }, context, [{
                blk: 1
            }]);

        // Go to the starting url before each test.
        await player.goto();
        await player.setPlayerInstance();

        const recorderPrefix = await player.getPlayerAttribute(`performanceprefix`);

        let performanceRecorder = await player.getPlayerAttribute(`performancerecords`);
        await expect(performanceRecorder.length).toBeGreaterThanOrEqual(1);
        const activationStartTime = performanceRecorder[0].startTime;
        await expect(performanceRecorder[0].name).toBe(`${recorderPrefix}-activated`);
        await expect(activationStartTime).toBeGreaterThan(0);

        await player.runMethod('_recordPerformance', [`new-performance-indicator`]);
        performanceRecorder = await player.getPlayerAttribute(`performancerecords`);
        await expect(performanceRecorder.length).toBeGreaterThanOrEqual(2);

        performanceRecorder = await player.getPlayerAttribute(`performancerecords`);
        // console.log(performanceRecorder);
    }

    await runTestMethod({
        page, browserName, browser, context
    }, runAdsTester, browserSettings);
});

import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL,
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

// Will test the player with autoplay and unmute on click
test.describe(`Check timeout on ads rendering settings`, () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        muted: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: AD_TAG_URL,
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: true, // If headless is true, player will start with user interaction
        devtools: false,
    }

    test.describe.configure({
        headless: true,
        mode: 'default',
        retries: 0,
        // timeout: 120_000,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`Check performance timing`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const adsRenderTimeout = 600;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                    adsrendertimeout: adsRenderTimeout
                }, context, [{
                    blk: 1
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const recorderPrefix = await player.getPlayerAttribute(`performanceprefix`);

            let performanceRecorder = await player.getPlayerAttribute(`performancerecords`);
            await expect(performanceRecorder.length).toBe(1);
            const activationStartTime = performanceRecorder[0].startTime;
            await expect(performanceRecorder[0].name).toBe(`${recorderPrefix}-activated`);
            await expect(activationStartTime).toBeGreaterThan(0);

            await player.runMethod('_recordPerformance', [`new-performance-indicator`]);
            performanceRecorder = await player.getPlayerAttribute(`performancerecords`);
            await expect(performanceRecorder.length).toBe(2);
            await expect(performanceRecorder[1].name).toBe(`${recorderPrefix}-new-performance-indicator`);
            await expect(performanceRecorder[1].duration).toBeGreaterThan(0);
            await expect(performanceRecorder[1].startTime).toBeGreaterThan(activationStartTime);

            performanceRecorder = await player.getPlayerAttribute(`performancerecords`);
            console.log(performanceRecorder);
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });
});

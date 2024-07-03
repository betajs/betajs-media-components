import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    BROWSER_LAUNCH_PATH, defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL,
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';


let descriptionPlayerAttributes = {
    autoplay: true,
    muted: true,
    unmuteonclick: true,
    skipinitial: false,
    width: 640, height: 360,
    adtagurl: AD_TAG_URL,
}

// Will test the player with autoplay and unmute on click
test.describe(`Check timeout on ads rendering settings`, () => {

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: false, // If headless is true, player will start with user interaction
        devtools: true,
        executablePath: BROWSER_LAUNCH_PATH,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        // timeout: 120_000,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`AdsRenderTimeout timeout should be enough to show ads`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const adsRenderTimeout = 10000;
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                    adsrendertimeout: adsRenderTimeout
                }, context, [{
                    blk: 0
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const adsContainer = page.locator(`.ba-adsplayer-linear-ad-container`);
            // const adsContainer = page.locator(`ba-adsplayer`);

            const hasAdsSource = await player.getPlayerAttribute(`adshassource`);
            await expect(hasAdsSource).not.toBeUndefined();
            if (!hasAdsSource) throw new Error(`We need ad tag URL to proceed`);
            let restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);

            const adsStarted = Promise.race([
                player.listenPlayerEvent(`ads:start`, 0)
                    .then(() => true),
                // ads:render-timeout also run ad-error at the end
                player.listenPlayerEvent(`ads:render-timeout`, 0)
                    .then(() => false),
            ]).catch(() => {
                throw "Missing content playing or ads container";
            });

            await adsStarted.then(async (adsVisible) => {
                // 10 seconds should be enough to show the ads
                await expect(adsVisible).toBeTruthy();
                // Wait ads container to be visible
                await expect(adsContainer).toBeVisible();
                await adsContainer.hover();

                // as soon as ads plays, reset timer should be as initial value
                restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
                await expect(restTimeout).toEqual(adsRenderTimeout);

                await browser.close();
            });
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    test(`AdsRenderTimeout should run on error URL`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const adsRenderTimeout = 10;
            const player = new PlayerPage(page,
                {
                  ...defaultPlayerAttributes, ...descriptionPlayerAttributes, ...{
                      adtagurl: ERROR_TAG_URL,
                      adsrendertimeout: adsRenderTimeout,
                    }
                }, context, [{
                    blk: 1
                }]
            );

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const contentPlayer = page.locator(`.ba-player-content > .ba-videoplayer-overlay`);
            const adsContainer = page.locator(`.ba-adsplayer-linear-ad-container`);
            // const adsContainer = page.locator(`ba-adsplayer`);

            const hasAdsSource = await player.getPlayerAttribute(`adshassource`);
            expect(hasAdsSource).not.toBeUndefined();
            if (!hasAdsSource) throw new Error(`We need ad tag URL to proceed`);

            await player.listenPlayerEvent(`ads:render-timeout`);
            // Ads container has to be visible as adsplayer_active will run timeout
            await (await adsContainer).waitFor({ state: 'attached', timeout: 5000 });
            // Content Player has to be visible on less of render timeout
            await expect(await contentPlayer).toBeVisible({ timeout: adsRenderTimeout + 20 });

            adsPlaying = await player.getPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeFalsy();

            let contentPlaying = await player.getPlayerAttribute(`playing`);
            await expect(contentPlaying).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({page, browserName, browser, context}, runAdsTester, browserSettings);
    });
});

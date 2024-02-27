import { test, expect, chromium, errors } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    CHROME_CANARY_LOCATION, defaultPlayerAttributes, AD_TAG_URL,
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
        headless: false, // If headless is true, player will start with user interaction
        devtools: true,
        executablePath: CHROME_CANARY_LOCATION,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        retries: 0,
        // timeout: 120_000,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`AdsRenderTimeout should run on error URL`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const adsRenderTimeout = 500;
            descriptionPlayerAttributes.adtagurl = ERROR_TAG_URL;
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

            const contentPlayer = page.locator(`.ba-player-content > .ba-videoplayer-overlay`);
            const adsContainer = page.locator(`.ba-adsplayer-linear-ad-container`);
            // const adsContainer = page.locator(`ba-adsplayer`);

            const hasAdsSource = await player.getPlayerAttribute(`adshassource`);
            expect(hasAdsSource).not.toBeUndefined();
            if (!hasAdsSource) throw new Error(`We need ad tag URL to proceed`);

            // Ads container has to be visible as adsplayer_active will run timeout
            await adsContainer.waitFor({ state: 'attached', timeout: 5000 });
            // Content Player has to be visible on less of render timeout
            await expect(contentPlayer).toBeVisible({ timeout: adsRenderTimeout + 20 });

            adsPlaying = await player.getPlayerAttribute(`adsplaying`);
            await expect(adsPlaying).toBeFalsy();

            let contentPlaying = await player.getPlayerAttribute(`playing`);
            await expect(contentPlaying).toBeTruthy();

            await browser.close();
        }

        await runTestMethod({page, browserName, browser, context}, runAdsTester, browserSettings);
    });

    test(`AdsRenderTimeout timeout should be enough to show ads`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying;
            const adsRenderTimeout = 10000;
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

            const adsContainer = page.locator(`.ba-adsplayer-linear-ad-container`);
            // const adsContainer = page.locator(`ba-adsplayer`);

            const hasAdsSource = await player.getPlayerAttribute(`adshassource`);
            await expect(hasAdsSource).not.toBeUndefined();
            if (!hasAdsSource) throw new Error(`We need ad tag URL to proceed`);
            let restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);

            const adsStarted = Promise.race([
                player.listenPlayerEvent(`ads:start`).then(() => true),
                // ads:render-timeout also run ad-error at the end
                player.listenPlayerEvent(`ads:ad-error`).then(
                    () => false
                ),
            ]).catch(() => {
                throw "Missing content playing or ads container";
            });

            await adsStarted.then(async (adsVisible) => {
                if (adsVisible) {
                    // Wait ads container to be visible
                    await expect(adsContainer).toBeInViewport(); //.toBeVisible() || .toBeInViewport();
                    await adsContainer.hover();

                    // as soon as ads plays, reset timer should be as initial value
                    restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
                    await expect(restTimeout).toEqual(adsRenderTimeout);
                } else {
                    adsPlaying = await player.getPlayerAttribute(`adsplaying`);
                    await expect(adsPlaying).toBeFalsy();

                    let contentPlaying = await player.getPlayerAttribute(`playing`);
                    await expect(contentPlaying).toBeTruthy();
                }

                await browser.close();
            });
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, browserSettings);
    });

    // test(`Random: Failsafe on ads load delay value`, async ({ page, browserName, browser, context }) => {
    //     const runAdsTester = async (page, browser, context) => {
    //         let adsPlaying, restTimeout;
    //         const adsRenderTimeout = Math.random() > 0.5 ? 15000 : 500;
    //         // delete defaultPlayerAttributes['poster'];
    //         const player = new PlayerPage(page,
    //             {
    //                 ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
    //                 adsrendertimeout: adsRenderTimeout
    //             }, context, [{
    //                 blk: 1
    //             }]);
    //
    //         // Go to the starting url before each test.
    //         await player.goto();
    //         await player.setPlayerInstance();
    //
    //         // Try to pause requests to avoid ads playing
    //         // await page.route(`${AD_TAG_URL}`, async route => {
    //         //     await new Promise(f => setTimeout(f, 1000));
    //         //     await route.continue();
    //         // });
    //
    //         const hasAdsSource = await player.getPlayerAttribute(`adshassource`);
    //         expect(hasAdsSource).not.toBeUndefined();
    //         if (!hasAdsSource) throw new Error(`We need ad tag URL to proceed`);
    //         const adsContainer = page.locator(`.ba-adsplayer-linear-ad-container`);
    //
    //         // const IMA_SDK_URL = new RegExp('https://imasdk.googleapis.com/js/*', 'i');
    //         // iframe .videoAdUi || .ima-sdk-frame
    //         // const adsContainer = page.frameLocator('iframe');
    //         // const adsContainer = page.frameLocator(`iframe[src=^https://imasdk.googleapis.com/js/*]`).locator('div.videoAdUi');
    //
    //         const adsStarted = Promise.race([
    //             player.listenPlayerEvent(`ads:start`).then(() => true),
    //             // ads:render-timeout also run ad-error at the end
    //             player.listenPlayerEvent(`ads:ad-error`).then(() => false),
    //         ]).catch(() => {
    //             throw "Missing content playing or ads container";
    //         });
    //
    //         await adsStarted.then(async (adsVisible) => {
    //             if (adsVisible) {
    //                 // Wait ads container to be visible
    //                 await expect(adsContainer).toBeInViewport(); //.toBeVisible() || .toBeInViewport();
    //                 await adsContainer.hover();
    //
    //                 // as soon as ads plays, reset timer should be as initial value
    //                 restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
    //                 await expect(restTimeout).toEqual(adsRenderTimeout);
    //             } else {
    //                 adsPlaying = await player.getPlayerAttribute(`adsplaying`);
    //                 await expect(adsPlaying).toBeFalsy();
    //
    //                 let contentPlaying = await player.getPlayerAttribute(`playing`);
    //                 await expect(contentPlaying).toBeTruthy();
    //             }
    //
    //             await browser.close();
    //         });
    //
    //         // try {
    //         //     restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
    //         //     // Wait ads container to be visible
    //         //     await expect(adsContainer).toBeInViewport({
    //         //         timeout: restTimeout + 20
    //         //     }); //.toBeVisible() || .toBeInViewport();
    //         //     await adsContainer.hover();
    //         // } catch (err) {
    //         //     if (err instanceof errors.TimeoutError) {
    //         //         restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
    //         //     } else {
    //         //         throw new Error(`Error not related to timeout occurred: ${JSON.stringify(err)}`);
    //         //     }
    //         // }
    //     }
    //
    //     await runTestMethod({page, browserName, browser, context}, runAdsTester, browserSettings);
    // });
});

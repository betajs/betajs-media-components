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
        adtagurl: ERROR_TAG_URL,
        // adtagurl: AD_TAG_URL,
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

    test(`Failsafe on ads load delay value`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            let adsPlaying, restTimeout;
            const adsRenderTimeout = Math.random() > 0.5 ? 5000 : 500;
            // delete defaultPlayerAttributes['poster'];
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

            // Try to pause requests to avoid ads playing
            // await page.route(`${AD_TAG_URL}`, async route => {
            //     await new Promise(f => setTimeout(f, 1000));
            //     await route.continue();
            // });

            const hasAdsSource = await player.getPlayerAttribute(`adshassource`);
            expect(hasAdsSource).not.toBeUndefined();
            if (!hasAdsSource) throw new Error(`We need ad tag URL to proceed`);

            const adsContainer = page.locator(`.ba-adsplayer-linear-ad-container`);
            const timePassed5Seconds = page.getByTitle(`Elapsed time`).and(page.getByText(`0:05`));

            // const IMA_SDK_URL = new RegExp('https://imasdk.googleapis.com/js/*', 'i');
            // iframe .videoAdUi || .ima-sdk-frame
            // const adsContainer = page.frameLocator('iframe');
            // const adsContainer = page.frameLocator(`iframe[src=^https://imasdk.googleapis.com/js/*]`).locator('div.videoAdUi');

            const adsContainerVisible = Promise.race([
                // player.listenPlayerEvent(`ads:load`, 0).then(() => true),
                adsContainer.waitFor({state: 'visible'})
                    .then(() => true),
                // player.listenPlayerEvent(`ads:render-timeout`, 0).then(() => false),
                timePassed5Seconds.waitFor({state: 'visible'})
                    .then(() => false),
            ]).catch(() => {
                throw "Missing content playing or ads container";
            });

            await adsContainerVisible.then(async (adsVisible) => {
                if (adsVisible) {
                    restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);

                    // Wait ads container to be visible
                    await expect(adsContainer).toBeInViewport(); //.toBeVisible() || .toBeInViewport();
                    await adsContainer.hover();

                    // as soon as ads plays, reset timer should be as initial value
                    restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
                    await expect(restTimeout).toEqual(adsRenderTimeout);
                } else {
                    // if error will be triggered, ads render timeout should be initial value
                    restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
                    expect(restTimeout).toBe(adsRenderTimeout);

                    adsPlaying = await player.getPlayerAttribute(`adsplaying`);
                    expect(adsPlaying).toBeFalsy();

                    let contentPlaying = await player.getPlayerAttribute(`playing`);
                    expect(contentPlaying).toBeTruthy();
                }

                await browser.close();
            });

            // try {
            //     restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
            //     // Wait ads container to be visible
            //     await expect(adsContainer).toBeInViewport({
            //         timeout: restTimeout + 20
            //     }); //.toBeVisible() || .toBeInViewport();
            //     await adsContainer.hover();
            // } catch (err) {
            //     if (err instanceof errors.TimeoutError) {
            //         restTimeout = await player.getPlayerAttribute(`adsrendertimeout`);
            //     } else {
            //         throw new Error(`Error not related to timeout occurred: ${JSON.stringify(err)}`);
            //     }
            // }
        }

        await runTestMethod({page, browserName, browser, context}, runAdsTester, browserSettings);
    });

});

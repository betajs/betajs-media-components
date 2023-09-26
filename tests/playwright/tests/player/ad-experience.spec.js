import { test, expect } from '@playwright/test';

import { URI } from '../../consts';
import createOptions from '../../utils/create-options';

// https://try.playwright.tech/?e=page-screenshot
// '?ad=1&blk=1&si=1&os=1&ap=1&ac=1&stk=0&sbr=1&flt=1&cmp=1';

test.describe('Testing Player Ads On AutoPlay', () => {
    const URL = `${URI}?${createOptions([
        {ad: 2}, {blk: 2}, 'si', 'ap'
    ])}`;

    test.describe.configure({
        mode: 'default', retries: 0, timeout: 20_000
    });

    test.beforeEach(async ({ page }, browserType) => {
        // Go to the starting url before each test.
        await page.goto(URL);
        console.log(`Will visit URL: ${page.url()}`);
    });

    test(`The video should start in a muted state by default`, async ({ page, browserName }, testInfo) => {
        // Assertions use the expect API.
        await expect(page).toHaveURL(URL);
        await page.screenshot({
            path: `./tests/playwright/screenshots/${(testInfo.title.replace(' ', '-')).slice(0, 20)}-${browserName}.png`
        });

        // await page.evaluate(eventName => {
        //     return new Promise(callback => document.addEventListener(eventName, callback, { once: true }));
        // }, 'player-ready');
        // await page.waitForEvent('player-ready');
        // const player = await page.evaluate(async (eventName) => {
        //     console.log("Event triggered...", eventName);
        //     return player;
        // }, 'player-ready');
        await page.evaluate(
            (eventName) => {
                console.log("Now event will be ", eventName);
                new Promise(
                    callback => window.addEventListener(eventName,
                        callback, { once: true })
                )
            }, 'player-ready');

        const player = page.evaluate(() => {
            return player;
        });

        console.log("Our player is : ", JSON.stringify(player));

        const videoElementContainer = await page.locator('.ba-videoplayer-overlay');
        // await videoElementContainer.first().dblclick();
        if (videoElementContainer) {
            const dimensions = await videoElementContainer.evaluate(() => {
                return {
                    width: document.documentElement.clientWidth,
                    height: document.documentElement.clientHeight,
                    deviceScaleFactor: window.devicePixelRatio
                }
            });
            // .boundingBox()
            console.log(" >> ", dimensions);
        }

    });
});

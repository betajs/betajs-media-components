import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";

// https://try.playwright.tech/?e=page-screenshot
// '?ad=1&blk=1&si=1&os=1&ap=1&ac=1&stk=0&sbr=1&flt=1&cmp=1';

test.describe('Testing Player Ads On AutoPlay', () => {
    let playerPage;
    test.describe.configure({
        mode: 'default', retries: 0, timeout: 20_000
    });


    test.beforeEach(async ({ page }, browserType) => {
        playerPage = new PlayerPage(page, [
            {ad: 2}, {blk: 2}, 'si', 'ap'
        ]);
        // Go to the starting url before each test.
        await playerPage.goto();
    });

    test(`The video should start in a muted state by default`, async ({ page, browserName, context }, testInfo) => {
        const screenShotTitle = `./tests/playwright/screenshots/${(testInfo.title.replaceAll(' ', '-')).slice(0, 20)}-${browserName}.png`;


        if (!playerPage) {
            throw new Error("Player page is not set");
        }
        // const dimensions = await playerPage.getContainerDimensions();

        // console.log("Dimensions are ", dimensions);
    });
});

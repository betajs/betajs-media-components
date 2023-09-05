import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";

// https://try.playwright.tech/?e=page-screenshot
// '?ad=1&blk=1&si=1&os=1&ap=1&ac=1&stk=0&sbr=1&flt=1&cmp=1';

test.describe('Testing Player Ads On AutoPlay', () => {
    let playerPage;
    test.describe.configure({
        mode: 'default', retries: 0, timeout: 20_000
    });

    test.beforeEach(async ({ page, context }, browserType) => {
        playerPage = new PlayerPage(page, [
            {ad: 1}, {blk: 1}, 'skipinitial', 'autoplay',
            {width: '640px'}, {height: '360px'}, {outstreamoptions: {corner: false}}
        ]);
        // console.log("Player context ", context);
        // Go to the starting url before each test.
        await playerPage.goto();
    });

    test(`The video should start in a muted state by default`, async ({ page, browserName, context }, testInfo) => {
        const screenShotTitle = `./tests/playwright/screenshots/${(testInfo.title.replaceAll(' ', '-')).slice(0, 20)}-${browserName}.png`;

        if (!playerPage) {
            throw new Error("Player page is not set");
        }

        await playerPage.waitForAdStarted();
        const dimensions = playerPage.getContainerDimensions();

        // ba-commoncss-icon-volume-off // ba-commoncss-icon-volume-up

        await playerPage.page.screenshot({ path: screenShotTitle });

        console.log("Player is ", dimensions);


        page.on('console', msg => console.log(msg.text()));

        // console.log("Dimensions are ", dimensions);
    });
});

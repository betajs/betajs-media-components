// TODO: need to improve..
import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    BROWSER_LAUNCH_PATH,
    defaultPlayerAttributes,
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';
import { closeToEqual, heightBasedOnWidth } from '../../utils';


const browserSettings = {
    // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
    headless: false, // If headless is true, player will start with user interaction
    devtools: true,
    executablePath: BROWSER_LAUNCH_PATH,
}


test.describe('Desktop simple floating', () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        unmuteonclick: true,
        showsidebargallery: false,
        sidebaroptions: {},
        playwhenvisible: true,
        floating: true,
        floatingoptions: {
            floatingonly: false
        },
        sticky: false,
    }

    test.describe.configure({
        headless: false,
        mode: 'default',
        retries: 0,
        // timeout: 120_000,
        viewport: { width: 1280, height: 720 },
        video: 'on-first-retry',
    });

    test(`Show when player disappear`, async (
        {
            page, browserName, browser, context
        }
    ) => {
        const runTest = async (page, browser, context) => {
            const player = new PlayerPage(page, {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                },
                context,
                [{
                    blk: 1
                }]
            );

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const container = await player.getElementByTestID(`player-container`);
            await expect(container).toBeVisible();

            await player.scrollToYPosition(1000);

        }
        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });

    test.skip(`floating should start after in article player will be visible`, async () => {});
    test.skip(`floating player dimensions should be different than player`, async () => {});
    test.skip(`floating player height should be what was set in the settings`, async () => {});
    test.skip(`floating only, should start to play`, async () => {});
    test.skip(`floating only, player container should not be visible`, async () => {});
});

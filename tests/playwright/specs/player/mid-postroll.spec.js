import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    BROWSER_LAUNCH_PATH, defaultPlayerAttributes, AD_TAG_URL,
    ERROR_TAG_URL, VMAP_AD_TAG,
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

// Will test the player with autoplay and unmute on click
test.describe(`VMAP Midroll`, () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: VMAP_AD_TAG,
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: false, // If headless is true, player will start with user interaction
        devtools: true,
        executablePath: BROWSER_LAUNCH_PATH,
    }

    test(`VMAP midroll`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        autoplay: true
                    }
                }, context, [{
                    blk: 2
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

        }
    });
});

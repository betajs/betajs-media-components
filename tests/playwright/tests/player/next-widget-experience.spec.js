import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    CHROME_CANARY_LOCATION, defaultPlayerAttributes, AD_TAGS
} from "../../consts.js";
import runTest from "../../utils/run-test";


// Will test the player with autoplay and unmute on click
test.describe('Next Widget', () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        muted: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: AD_TAGS[1],
    }

    const browserSettings = {
        // args: [`--user-data-dir="/tmp/chrome_dev_test"`, '--disable-web-security'],
        headless: false, // If headless is true, player will start with user interaction
        devtools: true,
        executablePath: CHROME_CANARY_LOCATION,
    }

    test(`Ads: With Preroll Ads`, async ({ page, browserName, browser, context }) => {
        const runAdsWithNextWidget = async (page, browser, context) => {

            descriptionPlayerAttributes.nextwidget = true; // if player activated next widget
            // How many seconds to wait before showing next widget
            descriptionPlayerAttributes.shownext = 2.5;
            // If not engaged, how many seconds to wait before showing next widget
            descriptionPlayerAttributes.noengagenext = 15;

            delete defaultPlayerAttributes["poster"];
            delete defaultPlayerAttributes["source"];

            const player = new PlayerPage(page,
                { ...defaultPlayerAttributes, ...descriptionPlayerAttributes }
                , context, [{
                    blk: 1
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.contentVideoExperienceFlowWithNextVideo({
                nextWidget: false,
                preroll: typeof descriptionPlayerAttributes.adtagurl !== 'undefined',
                stayEngaged: true
            });
        }

        await runTest(
            {page, browserName, browser, context}, runAdsWithNextWidet, browserSettings
        );
    });


    test(`Without Ads`, async ({ page, browserName, browser, context }) => {
        const runContentVideoWithNext = async (page, browser, context) => {

            descriptionPlayerAttributes.nextwidget = true; // if player activated next widget
            // How many seconds to wait before showing next widget
            descriptionPlayerAttributes.shownext = 2.5;
            // If not engaged, how many seconds to wait before showing next widget
            descriptionPlayerAttributes.noengagenext = 15;

            delete defaultPlayerAttributes["poster"];
            delete defaultPlayerAttributes["source"];
            delete descriptionPlayerAttributes["adtagurl"];

            const player = new PlayerPage(page,
                { ...defaultPlayerAttributes, ...descriptionPlayerAttributes }
                , context, [{
                    blk: 1
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.contentVideoExperienceFlowWithNextVideo({
                nextWidget: false,
                preroll: typeof descriptionPlayerAttributes.adtagurl !== 'undefined',
                stayEngaged: true
            });
        }

        await runTest({page, browserName, browser, context },
            runContentVideoWithNext, browserSettings
        );
    });
});

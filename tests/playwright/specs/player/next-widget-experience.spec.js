import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    CHROME_CANARY_LOCATION, defaultPlayerAttributes, AD_TAGS
} from "../../consts.js";
import runTest from "../../utils/run-test";


// Will test the player with autoplay and unmute on click
test.describe('Next Widget Tests', () => {

    delete defaultPlayerAttributes["poster"];
    delete defaultPlayerAttributes["source"];

    let descriptionPlayerAttributes = {
        autoplay: true,
        muted: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: AD_TAGS[1],
        nextwidget: true,
        // How many seconds to wait before showing next widget
        shownext: 3,
        // If not engaged, how many seconds to wait before showing next widget
        noengagenext: 10
    }

    const URIOptions = [{ blk: 1 }]

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


            const attrs = {...defaultPlayerAttributes, ...descriptionPlayerAttributes};
            const player = new PlayerPage(page, attrs, context, URIOptions);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.contentVideoExperienceFlowWithNextVideo({
                // state confirming it's only first video is playing
                nextWidget: true,
                preroll: typeof descriptionPlayerAttributes.adtagurl !== 'undefined',
                stayEngaged: true
            });
        }

        await runTest(
            {page, browserName, browser, context}, runAdsWithNextWidget, browserSettings
        );
    });


    test(`Content Player: Will show next video on the next click`, async ({ page, browserName, browser, context }) => {
        const runContentVideoWithNext = async (page, browser, context) => {

            delete descriptionPlayerAttributes["adtagurl"];

            const attrs = {...defaultPlayerAttributes, ...descriptionPlayerAttributes};
            const player = new PlayerPage(page, attrs, context, URIOptions);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.contentVideoExperienceFlowWithNextVideo({
                // state confirming it's only first video is playing
                nextWidget: false,
                preroll: typeof descriptionPlayerAttributes.adtagurl !== 'undefined',
                stayEngaged: true
            });
        }

        await runTest({page, browserName, browser, context },
            runContentVideoWithNext, browserSettings
        );
    });

    test(`Content Player: next video after timeout`, async ({ page, browserName, browser, context }) => {

    });

    test(`Content Player: Stay engaged and next video on timeout`, async ({ page, browserName, browser, context }) => {

    });
});

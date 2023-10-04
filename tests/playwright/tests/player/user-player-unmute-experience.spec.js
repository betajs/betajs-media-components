import { test, expect, chromium } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    CHROME_CANARY_LOCATION, defaultPlayerAttributes, AD_TAG_URL
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

// Will test the player with autoplay and unmute on click
test.describe('Desktop Player unmute autoplay player', () => {
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

    // test.beforeEach(async ({ page, browserName }) => {});

    test(`Ads user experience`, async ({ page, browserName, browser, context }) => {
        // const screenShotTitle = `./tests/playwright/screenshots/${(testInfo.title.replaceAll(' ', '-')).slice(0, 20)}-${browserName}.png`;

        const runAdsTester = async (page, browser, context) => {
            // delete defaultPlayerAttributes['poster'];
            const player = new PlayerPage(page,
                { ...defaultPlayerAttributes, ...descriptionPlayerAttributes }
                , context, [{
                    blk: 1
                }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const hasAdsSource = await player.getPlayerAttribute(`adshassource`);
            expect(hasAdsSource).not.toBeUndefined();

            if (!hasAdsSource) throw new Error(`We need ad tag URL to proceed`);

            await player.adExperienceFlow({
                skipAd: true, proceedWithContentPlayer: true
            });
        }

        await runTestMethod({page, browserName, browser, context}, runAdsTester, browserSettings);
    });

    test(`Video content user experience`, async ({ page, browserName, browser, context }) => {
        const runContentPlayerTest = async (page, browser, context) => {
            delete descriptionPlayerAttributes["adtagurl"];
            const player = new PlayerPage(page, Object.assign({},
                defaultPlayerAttributes, descriptionPlayerAttributes
            ), context, [{
                blk: 1
            }]);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.contentVideoExperienceFlow();
        }
        await runTestMethod({ page, browserName, browser, context }, runContentPlayerTest, browserSettings);
    });

    test(`Next Widget: Content experience`, async ({ page, browserName, browser, context }) => {

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
                nextWidget: true,
                preroll: typeof descriptionPlayerAttributes.adtagurl !== 'undefined'
            });
        }

        await runTestMethod({ page, browserName, browser, context }, runContentVideoWithNext, browserSettings);
    });
});

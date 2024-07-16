import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    defaultPlayerAttributes, transcript, WebVTTTextExample
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

// Will test the player with autoplay and unmute on click
test.describe(`Player track tags`, () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        skipinitial: true,
        width: 640, height: 360,
        tracktags: [
            {
                "kind": "captions",
                "label": "English",
                "srclang": "en",
                "content": WebVTTTextExample,
            }
        ]
    }

    test.describe.configure({
        headless: true,
        mode: 'default',
        // timeout: 120_000,
        video: 'on-first-retry',
    });

    test(`track tags first should be hidden, and become visible after setting auto enable`, async ({ page, browserName, browser, context }) => {
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes, ...descriptionPlayerAttributes,
                    ...{
                        autoenabledtracktags: [],
                    }
                }, context, []);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            let textTrackVisible = await player.getPlayerAttribute(`tracktextvisible`);
            await expect(textTrackVisible, `tracktextvisible has to be false, as subtitles it is not auto enabled`).toBeFalsy();

            await player.setPlayerAttribute(`autoenabledtracktags`, ['subtitles', 'captions']);
            await player.setPlayerAttribute(`tracktags`, [
                {
                    "kind": "subtitles",
                    "label": "English",
                    "srclang": "en",
                    "content": WebVTTTextExample,
                }
            ]);

            await player.listenPlayerEvent(`change:tracktextvisible`);

            textTrackVisible = await player.getPlayerAttribute(`tracktextvisible`);
            await expect(textTrackVisible, `track text should be visible`).toBeTruthy();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, { headless: true });
    });

    test(`track tags should be visible by default, as they are auto enabled`, async ({ page, browserName, browser, context }) => {
        descriptionPlayerAttributes.autoenabledtracktags = ['subtitles', 'captions'];
        const runAdsTester = async (page, browser, context) => {
            const player = new PlayerPage(page,
                {
                    ...defaultPlayerAttributes,
                    ...descriptionPlayerAttributes,
                    ...{
                        tracktags: [{
                            "kind": "subtitles",
                            "label": "English",
                            "srclang": "en",
                            "content": transcript,
                        }]
                    }
                }, context, []);

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            await player.listenPlayerEvent(`change:hassubtitles`);
            const hasSubtitle = await player.getPlayerAttribute(`hassubtitles`);
            await expect(hasSubtitle, `hassubtitles attribute has to be true`).toBeTruthy();

            let textTrackVisible = await player.getPlayerAttribute(`tracktextvisible`);
            await expect(textTrackVisible, `'tracktextvisible' has to be true as it was auto enabled`).toBeTruthy();
        }

        await runTestMethod({
            page, browserName, browser, context
        }, runAdsTester, { headless: true });
    });
});

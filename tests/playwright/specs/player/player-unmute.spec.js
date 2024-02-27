import { test, expect } from '@playwright/test';
import PlayerPage from "../../classes/PlayerPageClass";
import {
    CHROME_CANARY_LOCATION, defaultPlayerAttributes,
    AD_TAG_URL
} from "../../consts.js";
import runTestMethod from '../../utils/run-test';

test.describe('Unmute on click behave', () => {
    let descriptionPlayerAttributes = {
        autoplay: true,
        muted: true,
        unmuteonclick: true,
        skipinitial: false,
        width: 640, height: 360,
        adtagurl: AD_TAG_URL,
        showsidebargallery: true,
        sidebaroptions: {}
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

    test(`Unmute only on engagement inside ads`, async ({
        page, browserName, browser, context
    }) => {
        const runTest = async (page, browser, context) => {
            // delete defaultPlayerAttributes['poster'];
            const player = new PlayerPage(page, {
                ...defaultPlayerAttributes,
                ...descriptionPlayerAttributes
            }, context, [{
                blk: 1
            }]);

            const reloadPage = async (player, uMuteButton, dataTestId) => {
                const pauseButton = await page.getByTestId(`${dataTestId}-ads-controlbar-pause-button`);

                await page.reload();
                await player.setPlayerInstance();

                // Ads pause button should be visible
                await pauseButton.isVisible();

                // Initially player has to be muted
                const isMuted = await player.getPlayerAttribute("muted");
                await expect(isMuted).toBeTruthy();
                await uMuteButton.isVisible();
            }

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();
            // await player.listenPlayerEvent("attached", 5);

            const dataTestId = await player.getPlayerAttribute('testid');
            const hasAdsSource = await player.getPlayerAttribute(`adshassource`);
            expect(hasAdsSource).not.toBeUndefined();

            let unmuteOnClick = await player.getPlayerAttribute(`unmuteonclick`);
            await expect(unmuteOnClick).toBeTruthy();

            if (!hasAdsSource) throw new Error(`We need ad tag URL to proceed`);
            const playerContainer = await page.getByTestId(`${dataTestId}-player-container`);
            const contentPlayerContainer = await page.getByTestId(`${dataTestId}-content-player-container`);

            const adsStarted = Promise.race([
                player.listenPlayerEvent(`ads:start`, 0)
                    .then(() => true),
                player.listenPlayerEvent(`ads:ad-error`, 0)
                    .then(() => false),
            ]).catch(() => {
                throw "Missing content playing or ads container";
            });

            await adsStarted.then(async (adsVisible) => {
                if (adsVisible) {
                    const adsContainer = page.getByTestId(`${dataTestId}-ads-player-container`);
                    const adsMuteButton = page.getByTestId(`${dataTestId}-ads-controlbar-volume-mute`);
                    const adsUnMuteButton = page.getByTestId(`${dataTestId}-ads-controlbar-volume-unmute`);
                    // ba-commoncss-icon-volume-off
                    const adsMuteIcon = adsMuteButton.locator('i');
                    const adsUnMuteIcon = adsUnMuteButton.locator('i');
                    const adsPauseButton = page.getByTestId(`${dataTestId}-ads-controlbar-pause-button`);
                    const adsPlayButton = page.getByTestId(`${dataTestId}-ads-controlbar-play-button`);

                    let isMuted = await player.getPlayerAttribute("muted");
                    await expect(isMuted).toBeTruthy();

                    await adsContainer.hover({ timeout: 1_000 });
                    await expect(adsPauseButton).toBeVisible();
                    await adsPauseButton.click();

                    await expect(adsUnMuteIcon).toBeVisible();

                    isMuted = await player.getPlayerAttribute("muted");
                    await expect(isMuted).toBeTruthy();

                    await expect(adsPlayButton).toBeVisible();
                    await adsPlayButton.click();

                    await expect(adsMuteIcon).toBeVisible();
                    isMuted = await player.getPlayerAttribute("muted");
                    await expect(isMuted).toBeFalsy();

                    await playerContainer.hover({timeout: 1_000});

                    await reloadPage(player, adsUnMuteButton, dataTestId);
                    // Now click on the unmute player
                    await adsUnMuteButton.click();
                    // Unmute will take some time to reflect
                    await expect(adsMuteIcon).toBeVisible();
                    isMuted = await player.getPlayerAttribute("muted");
                    await expect(isMuted).toBeFalsy();
                } else {
                    await expect(contentPlayerContainer).toBeVisible();
                    await contentPlayerContainer.hover({timeout: 10_000});
                }
            });
        }

        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });

    test(`Content Player Unmute only on engagement`, async ({
        page, browserName, browser, context
    }) => {

        const runTest = async (page, browser, context) => {
            // delete defaultPlayerAttributes['poster'];
            delete descriptionPlayerAttributes['adtagurl'];
            const player = new PlayerPage(page, {
                ...defaultPlayerAttributes,
                ...descriptionPlayerAttributes
            }, context, [{
                blk: 1
            }]);

            const reloadPage = async (player, uMuteButton, dataTestId) => {
                const pauseButton = await page.getByTestId(`${dataTestId}-controlbar-pause-button`);

                await page.reload();
                await player.setPlayerInstance();

                // Ads pause button should be visible
                await pauseButton.isVisible();

                // Initially player has to be muted
                const isMuted = await player.getPlayerAttribute("muted");
                await expect(isMuted).toBeTruthy();
                await uMuteButton.isVisible();
            }

            // Go to the starting url before each test.
            await player.goto();
            await player.setPlayerInstance();

            const dataTestId = await player.getPlayerAttribute('testid');

            const unmuteOnClick = await player.getPlayerAttribute(`unmuteonclick`)
            await expect(unmuteOnClick).toBeTruthy();

            let unMuteButton = await page.getByTestId(`${dataTestId}-volume-unmute-button`);

            await unMuteButton.isVisible();
            let isMuted = await player.getPlayerAttribute("muted");
            await expect(isMuted).toBeTruthy();

            // await player.listenPlayerEvent("ads:adCanPlay", 10);
            const pauseButton = await page.getByTestId(`${dataTestId}-content-pause-button`);
            await pauseButton.isVisible();
            await pauseButton.click();
            // Unmute will take some time to reflect
            await page.waitForTimeout(500);

            isMuted = await player.getPlayerAttribute("muted");
            await expect(isMuted).toBeTruthy();

            const playButton = await page.getByTestId(`${dataTestId}-content-play-button`);

            await playButton.isVisible();
            await playButton.click();

            // Unmute will take some time to reflect
            await page.waitForTimeout(500);
            isMuted = await player.getPlayerAttribute("muted");
            let volume = await player.getPlayerAttribute("volume");
            await expect(volume).toBeGreaterThan(0);
            await expect(isMuted).toBeFalsy();

            const volumeMuteButton = await page.getByTestId(`${dataTestId}-volume-mute-button`);
            await volumeMuteButton.isVisible();

            // PART 2: Reload now click on the unmute button
            await reloadPage(player, unMuteButton, dataTestId);

            // Now click on the unmute player
            await page.waitForTimeout(300);
            await unMuteButton.click();
            await page.waitForTimeout(500);
            volume = await player.getPlayerAttribute("volume");
            isMuted = await player.getPlayerAttribute("muted");
            await expect(isMuted).toBeFalsy();
            await expect(volume).toBeGreaterThan(0);
        }

        await runTestMethod(
            {page, browserName, browser, context},
            runTest, browserSettings
        );
    });
});

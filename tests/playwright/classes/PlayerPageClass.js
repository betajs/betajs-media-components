const { expect } = require('@playwright/test')
import createOptions from '../utils/create-options';
import {
    ASSETS_PATH, PLAYER_URI, SAMPLE_VIDEO_POSTER,
    SAMPLE_2_VIDEO_POSTER, SAMPLE_3_VIDEO_POSTER
} from '../consts.js';


class PlayerPage {

    PLAYER_SELECTOR = '#player';
    PLAYER_CONTAINER_SELECTOR = '#player > .ba-videoplayer-container';
    PLAYER_AD_CONTAINER_SELECTOR = `ba-adsplayer > .ba-ad-container`;
    VIDEO_CONTENT_CONTROLBAR_CONTAINER_SELECTOR = `ba-videoplayer-controlbar > div.ba-player-dashboard > div.ba-videoplayer-controlbar`;
    ADS_CONTROLBAR_CONTAINER_SELECTOR = `ba-ads-controlbar .ba-adsplayer-controlbar`;
    ADS_BOTTOM_LINE_PROGRESSBAR_SELECTOR = `ba-ads-controlbar .ba-adsplayer-progressbar-container`;

    page = null;
    attrs = {};
    debug = false;
    playerInstance = null;

    constructor(page, attrs, context, urlOptions) {
        this.page = page;
        this.context = context;
        this.debug = false;
        this.fullURI = `${PLAYER_URI}?${createOptions(urlOptions)}`;
        this.attrs = attrs;
    }

    playerContainerLocator = () => this.page.locator('#player > .ba-videoplayer-container');
    playButtonLocator = () => this.page.locator('ba-videoplayer-controlbar').getByTitle('Play').locator('div');

    async goto() {
        await this.page.goto(this.fullURI, { waitUntil: 'load' });
        if (this.debug) console.log(`Will visit URL: ${this.page.url()}`);
    }

    async setPlayerInstance() {
        const PlayerClass = await this.page.evaluateHandle(
            () => window.BetaJS.MediaComponents.VideoPlayer.Dynamics.Player
        );
        return this.playerInstance = await PlayerClass.evaluateHandle(
            async (player, attrs) => {
                const element = document.querySelector('#player');
                const playerInstance = new player({
                    element,
                    attrs
                });
                window.player = playerInstance;
                playerInstance.activate();
                return Promise.resolve(playerInstance);
            }, this.attrs);
    }

    async playerContainerVisible() {
        const container = await this.page.locator(this.PLAYER_SELECTOR);
        await container.waitFor({ state: 'visible', timeout: 5000 });
        return container;
    }

    async adsPlayerContainerVisible() {
        const container = await this.page.locator(this.PLAYER_AD_CONTAINER_SELECTOR);
        await container.waitFor({ state: 'visible', timeout: 5000 });
        return container;
    }

    async getAdsPlayerAttribute(keyName) {
        if (!this.playerInstance)
            throw new Error(`Player instance is not set to be able to get attribute: ${keyName}`);
        const event = await this.playerInstance.evaluateHandle(async (ins, [key, debug]) => {
            if (typeof ins.scopes && typeof ins.scopes.adsplayer && typeof ins.scopes.adsplayer.get === 'function') {
                if (debug)
                    console.log(`We have to have value: ${ins.scopes.adsplayer.get(key)} for key: ${key}`);
                return Promise.resolve(ins.scopes.adsplayer.get(key));
            }
            throw new Error(`Ads Player instance does not have get method, to return ${keyName} value`);
        }, [keyName, this.debug]);
        return this.page.evaluate((e) => e, event);
    }

    /**
     * @param functionName
     * @param {Array|null} args
     * @return {Promise<*>}
     */
    async runFunctions(functionName, args = null) {
        if (!this.playerInstance) throw new Error(`Player instance is not set to be able to get attribute: ${arg}`);
        return this.playerInstance.evaluate(async (ins, functionName, args) => {
            if (typeof ins[functionName] !== 'function')
                throw new Error(`Player instance does not have ${functionName} method`);
            try {
                await args ? ins[functionName].call(ins, ...args) : ins[functionName].call(ins);
                return Promise.resolve(true);
            } catch (e) {
                return await Promise.reject(e);
            }
        }, functionName, args);
    }

    async getPlayerAttribute(keyName) {
        if (!this.playerInstance)
            throw new Error(`Player instance is not set to be able to get attribute: ${keyName}`);
        return this.playerInstance.evaluate(async (ins, key) => {
            if (typeof ins.get !== 'function')
                throw new Error(`Player instance does not have get method`);
            return Promise.resolve(ins.get(key));
        }, keyName);
    }

    async getPlayerMultipleAttributes(attributes) {
        if (!this.playerInstance) throw new Error(`Player instance is not set to be able to get attribute: ${arg}`);
        return await this.playerInstance.evaluate(async (ins, keys) => {
            if (!Array.isArray(keys))
                throw new Error(`Provided attributes should be in array format`);
            if (typeof ins.get !== 'function')
                throw new Error(`Player instance does not have get method`);
            return Promise.resolve(attributes.map(key => ins.get(key)));
        }, attributes);
    }

    async getLocatorInState(
        selector, container = null, state, testIt = false, timeout = 3000
    ) {
        if (this.debug) console.log(`Looking for selector ${selector}`);
        const parent = container || this.page;
        const locator = await parent.locator(selector);
        state = state || 'visible';
        await locator.waitFor({ state, timeout });
        if (testIt) await expect(locator).toBeVisible();
        return locator;
    }

    async setPlayerAttribute(keyName) {
        if (!this.playerInstance) throw new Error(`Player instance is not set to be able to get attribute: ${keyName}`);
        return await this.playerInstance.evaluate(async (ins, key) => {
            if (typeof ins.get !== 'function' || typeof ins.set !== 'function')
                throw new Error(`Player instance does not have get/set method`);
            ins.set(key);
            return Promise.resolve(ins.get(key));
        }, keyName);
    }

    /**
     * NOTE: TESTED Works as expected, force not tested
     * @param {string} eventName
     * @param {Number} timeOutSeconds
     * @param {Boolean} force
     * @return {Promise<*>}
     */
    async listenPlayerEvent(eventName, timeOutSeconds = 5, force = false) {
        return await this.page.waitForFunction(([eventName, timeOut, force, debug]) => {
            const promise = new Promise((resolve, reject) => {
                const playerInstance = window.player;
                if (typeof playerInstance.on !== 'function') {
                    const message = `Player instance does not have get method`;
                    if (force) { console.log(message); return reject(); }
                    new Error(message);
                }
                let timeoutID = null;
                if (timeOut > 0) {
                    timeoutID = setTimeout(() => {
                        const message = `Event ${eventName} was not fired in ${timeOut} seconds`;
                        if (force) { console.log(message); return reject(); }
                        throw new Error(message);
                    }, timeOut * 1000);
                }
                playerInstance.on(eventName, (data) => {
                    if (debug) console.log(`Will handle event ${eventName} and return data: ${data}`);
                    if (timeoutID) clearTimeout(timeoutID);
                    return resolve(data);
                });
            })
            return promise.then((d) => true).catch(() => force);
        }, [eventName, timeOutSeconds, force, this.debug], { timeout: (timeOutSeconds + 0.5) * 1000 });
    }

    /**
     * NOTE: Tested works as expected
     * Wait some seconds passing provided position argument
     * @param waitFor
     * @param debug
     * @param timeout
     * @return {Promise<*>}
     */
    async waitNextSecondPosition(waitFor = 1, debug = false, timeout = 12000) {
        const position = await this.getPlayerAttribute(`position`);
        const isPlaying = await this.getPlayerAttribute(`playing`);
        return this.page.waitForFunction(
            (args) => {
                const [cp, isPlaying, wait, debug] = args;
                if (debug)
                    console.log(`Current position: ${window.player.get("position")} and wait for: ${cp + wait}`);
                return window.player.get("position") >= (cp + wait) || isPlaying;
            }, [position, isPlaying, waitFor, debug], {timeout}
        );
    }

    /**
     *
     * @param position
     * @param timeout
     * @return {Promise<*>}
     */
    async waitAdsRemainingSeconds(position = null, timeout = 12000) {
        position = position || (await this.getAdsPlayerAttribute(`remaining`) - 1);
        return this.page.waitForFunction(
            ([remaining, debug]) => {
                if (typeof window.player.scopes.adsplayer === "undefined")
                    throw new Error(`Seems ads not active get it's remaining position: ${position}`);
                if (debug)
                    console.log(`Waited remaining ${remaining} and current remaining ${window.player.scopes.adsplayer.get("remaining")}`);
                return window.player.scopes.adsplayer.get("remaining") < remaining
            }, [position, this.debug], { timeout }
        );
    }

    async locatorClickWithDelay(locator, delay = 1000) {
        await new Promise((r) => setTimeout(() => {
            locator.click();
            return r();
        }, delay));
    }

    /**
     * NOTE: Tested works as expected
     * @param args // [key, truth = true]
     * @return {Promise<*>}
     */
    async waitForBooleanState(args) {
        args = typeof args === 'string' ? [args, true, this.debug] : [...args, this.debug];
        // Returns when the pageFunction returns a truthy value. It resolves to a JSHandle of the truthy value.
        return await this.page.waitForFunction(
            ([k, st, debug]) => {
                if (typeof window.player.get(k) === "undefined") return false;
                if (debug)
                    console.log(`Key: ${k} and value ${window.player.get(k)}, Statement ${st} and it is type ${typeof st}`);
                return typeof window.player.get(k) === 'boolean' && Boolean(window.player.get(k)) === st
            }, args
        );
    }

    /**
     * @param args // [key, truth = true]
     * @return {Promise<*>}
     */
    async waitForAdsBooleanState(args) {
        args = typeof args === 'string' ? [args, true, this.debug] : [...args, this.debug];
        // Returns when the pageFunction returns a truthy value. It resolves to a JSHandle of the truthy value.
        return await this.page.waitForFunction(
            ([k, st, debug]) => {
                if (window.player.scopes.adsplayer && typeof window.player.scopes.adsplayer.get(k) === "undefined") return false;
                if (debug) console.log(`Key: ${k} and value ${window.player.get(k)}, Statement ${st} and it is type ${typeof st}`);
                return typeof window.player.scopes.adsplayer.get(k) === 'boolean' && Boolean(window.player.scopes.adsplayer.get(k)) === st
            }, args
        );
    }

    // after found page: page.waitForTimeout()
    async delay(delay = 5) {
        await this.page.evaluate(async() => {
            await new Promise(function(resolve) {
                setTimeout(resolve, delay);
            });
        }, delay);
    }

    async setForPlayerContainer() {
        this.playerContainer = await this.playerContainerLocator();
    }

    async pressPlayContainerButton() {
        await this.playButtonLocator().click();
    }

    async isPageClosed() {
        return await this.page.isClosed();
    }

    async isPlayerMuted() {
        const volume = await this.getPlayerAttribute(`volume`);
        return volume === 0;
    }

    async waitForAdInitialized() {
        return await this.page.evaluate(async (eventName) => {
            return new Promise(cb => {
                document.addEventListener(eventName, data => {
                    return cb(data.detail);
                }, { once: true });
            });
        }, 'ads-initialized');
    }

    async adExperienceFlow(options) {
        let {
            skipAd = true, proceedWithContentPlayer = true
        } = options;

        // /*imasdk.googleapis.com\/js\/core\/bridge*/
        let iFrame = await this.page.frameLocator('iframe[src*="//imasdk.googleapis.com/js/core/bridge"]');
        if (!iFrame) {
            // waitForEvent("frameattached"), framenavigated, console
            // Get frame using frame's URL
            const responsePromise = this.page.waitForResponse(/.*imasdk.googleapis.com\/js\/core\/bridge*/);
            await responsePromise;
            iFrame = await this.page.frameLocator('iframe[src*="//imasdk.googleapis.com/js/core/bridge"]');
        }

        // First listen ads will be loaded
        await this.listenPlayerEvent('ad:loaded', {
            timeout: 10_000,
        }); // <<-- triggered by manager

        // For this period ads manager already has to be loaded and be true
        await this.waitForBooleanState('adsmanagerloaded');
        // Will wait while ads will be initialized
        await this.waitForBooleanState(['adsinitialized', true]);

        const playerContainer = await this.playerContainerVisible();

        // Ads container to be visible
        const adsContainer = await this.adsPlayerContainerVisible();
        await expect(adsContainer).toBeVisible();

        let volume = await this.getAdsPlayerAttribute('volume');
        expect(volume).toEqual(0);

        await playerContainer.hover();
        // Expect muted icon to be visible also we have inside ba-krg-player-controlbar
        const adsControlbarContainer = await this.getLocatorInState(
            this.ADS_CONTROLBAR_CONTAINER_SELECTOR, playerContainer, 'visible',true
        );

        // Hover over container to be able to see buttons
        await expect(adsControlbarContainer).toBeVisible();

        const unmutedVolume = adsControlbarContainer.getByTitle(`Unmute sound`);
        unmutedVolume.waitFor({ state: 'visible', timeout: 3000 });
        await expect(unmutedVolume).toBeVisible();

        const pauseButton = await adsControlbarContainer.getByTitle(`Pause`);
        await expect(pauseButton).toBeVisible();

        const volumeProgressBar = await this.getLocatorInState(
            `.ba-adsplayer-volumebar-inner`, null,
            'visible', true
        );

        // find click through button
        // const iframeClick = await iFrame.locator('.videoAdUiClickElement');
        // iframeClick.waitFor({ state: 'visible', timeout: 5000 });
        // await expect(iframeClick).toBeVisible();

        // First click has to unmute the player
        await playerContainer.click();

        // Will wait while remaining seconds will be less than 3
        await this.waitAdsRemainingSeconds(5);

        const muteVolume = await adsControlbarContainer.getByTitle(`Mute sound`);
        await muteVolume.waitFor({ state: 'visible', timeout: 3000 });
        await expect(muteVolume).toBeVisible();

        let tooltipContainer;
        const clickThroughUrl = await this.getAdsPlayerAttribute('addata.clickThroughUrl');
        const tooltipClickThoroughText = await this.getPlayerAttribute('presetedtooltips.onclicktroughexistence.tooltiptext');
        if (clickThroughUrl && tooltipClickThoroughText) {
            tooltipContainer = await playerContainer.getByRole('tooltip', { name: tooltipClickThoroughText });
            // Only if there is click through URL tooltip should be visible.
            await expect(tooltipContainer).toBeVisible();
        }

        await this.waitAdsRemainingSeconds();

        let isMuted = await this.getAdsPlayerAttribute('muted');
        expect(isMuted).toBeFalsy();

        volume = await this.getAdsPlayerAttribute('volume');
        expect(volume).toBeGreaterThan(0.0);

        // Will wait while remaining seconds will be less than 3
        await this.waitAdsRemainingSeconds();

        await muteVolume.click();
        volume = await this.getAdsPlayerAttribute('volume');
        await expect(volume).toBe(0);
        await expect(muteVolume).toBeVisible();

        // Will wait while remaining seconds will be less than 3
        await this.waitAdsRemainingSeconds();

        await pauseButton.click();

        const playButton = await adsControlbarContainer.getByTitle(`Play`);
        await playButton.waitFor({ state: 'visible', timeout: 1000 });
        await expect(playButton).toBeVisible();
        await playButton.click();
        await expect(pauseButton).toBeVisible();

        await unmutedVolume.waitFor({ state: 'visible', timeout: 1000 });
        await unmutedVolume.click();
        await expect(muteVolume).toBeVisible();

        // Will wait while remaining seconds will be less than 3
        await this.waitAdsRemainingSeconds(3);

        if (typeof tooltipContainer !== "undefined") {
            // tooltipContainer should not be visible for this period
            await expect(tooltipContainer).not.toBeVisible();
        }

        if (skipAd) {
            if (iFrame) {
                const skipButton = iFrame.locator(`button.videoAdUiSkipButton`);
                await skipButton.waitFor({ state: 'visible', timeout: 3000 });
                await skipButton.click();
            } else {
                throw new Error(`could not be able get iFrame containing skip button`);
            }
        }

        isMuted = await this.getAdsPlayerAttribute('muted');
        volume = await this.getAdsPlayerAttribute('volume');

        if (proceedWithContentPlayer)
            await this.contentVideoExperienceFlow(isMuted && volume >= 0, true);
    }

    /**
     * Content player experience flow
     * @param muted
     * @param fromAd
     * @return {Promise<*>}
     */
    async contentVideoExperienceFlow(muted = false, fromAd = false) {
        let toggleMuteState, isMuted, currentMuteState, isPlaying, playPauseToggle, position;
        // If user already had interaction with player this mostly means it's coming from ads
        const userHasInteraction = await this.getAdsPlayerAttribute(`userhadplayerinteraction`);
        fromAd ? expect(userHasInteraction).toBeTruthy() : expect(userHasInteraction).toBeFalsy;

        const playerContainer = await this.playerContainerVisible();

        await this.waitNextSecondPosition(2);
        playerContainer.hover();
        const controlbarContainer = await this.getLocatorInState(
            this.VIDEO_CONTENT_CONTROLBAR_CONTAINER_SELECTOR, playerContainer, 'visible', true
        );

        isMuted = await this.isPlayerMuted();

        toggleMuteState = await controlbarContainer.getByTitle(isMuted ? `Unmute sound` : `Mute sound`);
        await toggleMuteState.waitFor({ state: 'visible', timeout: 3000 });
        await expect(toggleMuteState).toBeVisible();
        await toggleMuteState.click();

        await this.waitNextSecondPosition(2);

        currentMuteState = await this.isPlayerMuted();
        // await this.waitNextSecondPosition(2); // NOTE: don't remove line. Sometimes will cause to fail test
        console.log(`Current mute state: ${currentMuteState} and expected NOT/opposite: ${isMuted}`);
        await expect(isMuted).not.toBe(currentMuteState);

        isMuted = await this.isPlayerMuted();
        position = await this.getPlayerAttribute(`position`);

        await this.waitNextSecondPosition(2);

        toggleMuteState = await controlbarContainer.getByTitle(isMuted ? `Unmute sound` : `Mute sound`);
        await expect(toggleMuteState).toBeVisible();
        await toggleMuteState.click();
        await this.waitNextSecondPosition(2);

        playerContainer.hover();
        isMuted = await this.isPlayerMuted();
        // At the end make sure player is unmuted
        if (isMuted) {
            toggleMuteState = await controlbarContainer.getByTitle(isMuted ? `Unmute sound` : `Mute sound`);
            toggleMuteState.click();
        }

        await this.waitNextSecondPosition();

        isPlaying = await this.getPlayerAttribute(`playing`);
        playPauseToggle = await controlbarContainer.getByTitle(isPlaying ? `Pause` : `Play`);
        await expect(playPauseToggle).toBeVisible();
        await playPauseToggle.click();
        await expect(isPlaying).not.toBe(await this.getPlayerAttribute(`playing`));

        isPlaying = await this.getPlayerAttribute(`playing`);

        // Play again
        if (!isPlaying) {
            playPauseToggle = await controlbarContainer.getByTitle(isPlaying ? `Pause` : `Play`);
            await playPauseToggle.click();
        }

        expect(await this.getPlayerAttribute(`playing`)).toBeTruthy();
        await this.waitNextSecondPosition();
        expect(position).toBeLessThan(await this.getPlayerAttribute(`position`));
    }

    /**
     * @return {Promise<void>}
     * @param options
     */
    async contentVideoExperienceFlowWithNextVideo( options ) {
        let { shownext, noengagenext } = this.attrs;
        let {
            nextEngaged = true,
            unmuteOnClick = true,
            recurring = true,
            mutedOnStart = true,
            preroll = false,
            stayEngaged = false,
            turns = 0
        } = options;

        ++turns;
        let volume, position, playButton, unmuteButton, muteButton, isPlaying;

        if (preroll) {
            await this.adExperienceFlow({
                skipAd: true,
                proceedWithContentPlayer: false
            });
            mutedOnStart = false;
        }

        const playerContainer = await this.playerContainerVisible();
        const pauseButton = await this.getLocatorInState(
            `.ba-videoplayer-leftbutton-container[title="Pause"]`, playerContainer, 'visible', true
        );

        if (!shownext) shownext = await this.getPlayerAttribute(`shownext`);
        const nextWidgetContainer = await this.getLocatorInState(
            `.ba-player-toggle-next-container`, playerContainer, 'visible', true,
            (shownext + 2) * 1000
        );
        const nextButton = await nextWidgetContainer.locator('a').filter({ hasText: 'Next Video' });
        const waitButton = await nextWidgetContainer.locator('a').filter({ hasText: 'Stay & Watch' });
        // getByRole('img')

        await expect(nextButton).toBeVisible();
        await expect(waitButton).toBeVisible();

        position = await this.getPlayerAttribute(`position`);
        await expect(position).toBeLessThanOrEqual(shownext);

        if (recurring && turns <= 2) {
            const nextWidgetPoster = await this.getLocatorInState(
                `img[src="${turns === 1 ? SAMPLE_3_VIDEO_POSTER : SAMPLE_2_VIDEO_POSTER }"]`,
                playerContainer, 'visible', true
            );
        } else {
            await pauseButton.click();
            // NOTE: not recommended to use page.delay
            await this.page.waitForTimeout(3000);
        }

        position = await this.getPlayerAttribute(`position`);
        await expect(position).toBeGreaterThanOrEqual(shownext);

        if (unmuteOnClick) {
            volume = await this.getPlayerAttribute(`volume`);
            if (mutedOnStart) {
                if (recurring) {
                    expect(volume).toEqual(0);
                    unmuteButton = await this.getLocatorInState(
                        `.ba-videoplayer-rightbutton-container[title="Unmute sound"]`,
                        playerContainer, 'visible', true
                    );
                }
                isPlaying = await this.getPlayerAttribute(`playing`);
                if (isPlaying) await this.waitNextSecondPosition(5);

                stayEngaged ? await waitButton.click() : await nextButton.click();

                if (recurring) {
                    await this.listenPlayerEvent(`change:volume`);
                    volume = await this.getPlayerAttribute(`volume`);
                    await expect(volume).toBeGreaterThan(0);

                    muteButton = await this.getLocatorInState(
                        `.ba-videoplayer-rightbutton-container[title="Mute sound"]`,
                        playerContainer, 'visible', true
                    );
                }
            } else {
                await expect(volume).toBeGreaterThan(0);
                muteButton = await this.getLocatorInState(
                    `.ba-videoplayer-rightbutton-container[title="Mute sound"]`,
                    playerContainer, 'visible', true
                );
                isPlaying = await this.getPlayerAttribute(`playing`);
                if (isPlaying) await this.waitNextSecondPosition(5);
                stayEngaged ? await waitButton.click() : await nextButton.click();
            }

            if (turns < 2) {
                if (unmuteButton && await unmuteButton.isVisible()) {
                    await unmuteButton.click();
                    await expect(muteButton).toBeVisible();
                }

                volume = await this.getPlayerAttribute(`volume`);
                await expect(volume).toBeGreaterThan(0);

                isPlaying = await this.getPlayerAttribute(`playing`);
                if (isPlaying) await pauseButton.click();

                playButton = await this.getLocatorInState(
                    `.ba-videoplayer-leftbutton-container[title="Play"]`,
                    playerContainer, 'visible', true
                );

                if (await playButton.isVisible()) await playButton.click();
                await expect(pauseButton).toBeVisible();

                if (!stayEngaged) {
                    await expect(nextWidgetContainer).toBeVisible({ timeout: 3_000 });
                    await expect(nextButton).toBeVisible();
                    await nextButton.click();
                    if (recurring) {
                        await this.contentVideoExperienceFlowWithNextVideo(
                            {...options, recurring: false, turns, stayEngaged: turns >= 2}
                        )
                    } else {
                        await pauseButton.click();
                        await expect(await playButton.isVisible()).toBeTruthy();

                        await expect(playButton).toBeVisible();
                    }
                } else {
                    await expect(nextWidgetContainer).not.toBeVisible();

                    await pauseButton.click();
                    await expect(playButton).toBeVisible();
                }
            }
        }
    }

}

export default PlayerPage;

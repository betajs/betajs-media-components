const { expect } = require('@playwright/test')
import createOptions from '../utils/create-options';
import { PLAYER_URI } from '../consts.js';


class PlayerPage {

    page = null;
    attrs = {};
    debug = false;
    playerInstance = null;
    testid = 'ba-testid';

    constructor(page, attrs, context, urlOptions, testid = 'ba-testid') {
        this.page = page;
        this.context = context;
        this.debug = false;
        this.fullURI = `${PLAYER_URI}?${createOptions(urlOptions)}`;
        this.attrs = attrs;
        this.testid = testid;
    }

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
    async runMethod(functionName, args = null) {
        args = args || [];
        if (!this.playerInstance) {
            throw new Error(`Player instance is not set to be able to get attribute: ${args}`);
        }
        return this.playerInstance.evaluate(async (ins, [functionName, args]) => {
            if (typeof ins[functionName] !== 'function')
                throw new Error(`Player instance does not have ${functionName} method`);
            try {
                await args ? ins[functionName].call(ins, ...args) : ins[functionName].call(ins);
                return Promise.resolve(true);
            } catch (e) {
                return await Promise.reject(e);
            }
        }, [functionName, args]);
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

    async setPlayerAttribute(keyName, value) {
        if (!this.playerInstance) throw new Error(`Player instance is not set to be able to get attribute: ${keyName}`);
        return await this.playerInstance.evaluate(async (ins, [key, val]) => {
            if (typeof ins.get !== 'function' || typeof ins.set !== 'function')
                throw new Error(`Player instance does not have get/set method`);
            ins.set(key, val);
            return Promise.resolve(ins.get(key));
        }, [keyName, value]);
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
                if (eventName.includes(":")) {
                    const channel = eventName.split(":")[0];
                    const event = eventName.split(":")[1];
                    playerInstance.channel(channel).on(event, (data) => {
                        if (debug) console.log(`Will handle event ${eventName} and return data: ${data}`);
                        if (timeoutID) clearTimeout(timeoutID);
                        return resolve(data);
                    });
                } else {
                    playerInstance.on(eventName, (data) => {
                        if (debug) console.log(`Will handle event ${eventName} and return data: ${data}`);
                        if (timeoutID) clearTimeout(timeoutID);
                        return resolve(data);
                    });
                }
            })
            return promise.then((d) => true).catch(() => force);
        }, [eventName, timeOutSeconds, force, this.debug], { timeout: timeOutSeconds * 1000 });
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

    // after found page: page.waitForTimeout()
    async delay(delay = 5) {
        await this.page.evaluate(async() => {
            await new Promise(function(resolve) {
                setTimeout(resolve, delay);
            });
        }, delay);
    }
}

export default PlayerPage;

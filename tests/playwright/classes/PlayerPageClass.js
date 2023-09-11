const { expect } = require('@playwright/test')
import createOptions from '../utils/create-options';
import {PLAYER_URI} from '../consts.js';


class PlayerPage {

    PLAYER_CONTAINER_SELECTOR = 'ba-videoplayer-container';
    PLAYER_AD_CONTAINER_SELECTOR = `ba-ad-container`;

    constructor(page, attrs, urlOptions) {
        this.page = page;
        this.fullURI = `${PLAYER_URI}?${createOptions(urlOptions)}`;
        this.attrs = attrs;
        this.playerInstace = null;
        this.playerContainer = null;
    }

    playerContainerLocator = () => this.page.locator('css=ba-videoplayer-container');
    playButtonLocator = () => this.page.locator('ba-videoplayer-controlbar').getByTitle('Play').locator('div');

    async goto() {
        await this.page.goto(this.fullURI, { waitUntil: 'load' });
        console.log(`Will visit URL: ${this.page.url()}`);
    }

    async setPlayerInstance() {
        const PlayerClass = await this.page.evaluateHandle(
            () => window.BetaJS.MediaComponents.VideoPlayer.Dynamics.Player
        );
        return this.playerInstace = await PlayerClass.evaluateHandle(
            async (player, attrs) => {
                const element = document.querySelector('#player');
                const ins = new player({
                    element,
                    attrs
                });
                ins.activate();
                return Promise.resolve(ins);
            }, this.attrs);
    }

    /**
     * @param functionName
     * @param args
     * @return {Promise<*>}
     */
    async runFunctions(functionName, args) {
        if (!this.playerInstace) throw new Error(`Player instance is not set to be able to get attribute: ${arg}`);
        return this.playerInstace.evaluate(async (ins, functionName, args) => {
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
        if (!this.playerInstace) throw new Error(`Player instance is not set to be able to get attribute: ${arg}`);
        return this.playerInstace.evaluate(async (ins, key) => {
            if (typeof ins.get !== 'function')
                throw new Error(`Player instance does not have get method`);
            return Promise.resolve(ins.get(key));
        }, keyName);
    }

    async getPlayerMultipleAttributes(attributes) {
        if (!this.playerInstace) throw new Error(`Player instance is not set to be able to get attribute: ${arg}`);
        return await this.playerInstace.evaluate(async (ins, keys) => {
            if (!Array.isArray(keys))
                throw new Error(`Provided attributes should be in array format`);
            if (typeof ins.get !== 'function')
                throw new Error(`Player instance does not have get method`);
            return Promise.resolve(attributes.map(key => ins.get(key)));
        }, attributes);
    }


    async setPlayerAttribute(keyName) {
        if (!this.playerInstace) throw new Error(`Player instance is not set to be able to get attribute: ${arg}`);
        return await this.playerInstace.evaluate(async (ins, key) => {
            if (typeof ins.get !== 'function' || typeof ins.set !== 'function')
                throw new Error(`Player instance does not have get/set method`);
            ins.set(key);
            return Promise.resolve(ins.get(key));
        }, keyName);
    }

    async adsPlayerContainerVisible() {
        await this.page.waitForSelector(this.PLAYER_AD_CONTAINER_SELECTOR, {
            state: 'visible', timeout: 3_000
        });
        return await this.page.locator(this.PLAYER_AD_CONTAINER_SELECTOR);
    }

    async listenPlayerEvent(eventName, timeOut = 5) {
        if (!this.playerInstace) throw new Error(`Player instance is not set to be able to get attribute: ${arg}`);
        return await this.playerInstace.evaluate(async (ins, eventName, timeOut) => {
            if (typeof ins.on !== 'function')
                throw new Error(`Player instance does not have get method`);
            ins.on(eventName, (data) => {
                console.log("Shoudl response succss..", data);
                return Promise.resolve(data);
            });
            if (timeOut > 0) {
                setTimeout(() => {
                    console.log("Will reject via ...");
                    return Promise.reject(`Event ${eventName} was not fired in ${timeOut} seconds`);
                }, timeOut * 1000);
            }
        }, eventName, timeOut);
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

    async _setPlayer() {
        // this.player = await this.page.evaluate(async () => {
        //     return window.BetaJSPlayer;
        // });
        // this.player = await this.page.evaluate('player');
        // this.player = this.page.evaluate((player) => {
        //     console.log("Now event will be ", player);
        // }, 'player');
        // this.player = await this.page.evaluateHandle(() => player);
        // this.player = await this.page.evaluateHandle(() => Promise.resolve(window));
        // this.player = await this.page.evaluateHandle('window.player');
    }

    async waitForPlayerContainer() {
        const videoElementContainer = await this.page.waitForSelector(this.PLAYER_CONTAINER_SELECTOR, {
            state: 'visible', timeout: 10_000
        });
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

    async getContainerDimensions() {
        // await videoElementContainer.first().dblclick();
        if (this.playerContainer) {
            // return await this.playerContainer.evaluate(() => {
            //     return {
            //         width: this.playerContainer.clientWidth,
            //         height: this.playerContainer.clientHeight,
            //     }
            // });
            return await this.playerContainer.boundingBox();
        } else {
            throw new Error("Player container is not set");
        }
    }
}

export default PlayerPage;

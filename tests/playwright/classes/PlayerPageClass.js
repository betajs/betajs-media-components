const { expect } = require('@playwright/test')
import createOptions from '../utils/create-options';
import {URI} from '../consts.js';

const playerContentSelector = '.ba-videoplayer-container';

class PlayerPage {

    constructor(page, urlOptions) {
        this.page = page;
        this.fullURI = `${URI}?${createOptions(urlOptions)}`;
        this.player = null;
        this.playerContainer = null;
    }

    async goto() {
        await this.page.goto(this.fullURI, { waitUntil: 'load' });
        const waitPlayerActivationPromise = this.page.evaluate(async (eventName) => {
            return new Promise(cb => {
                document.addEventListener(eventName, data => {
                    console.log("And callbak", data.detail);
                    return cb(data.detail);
                }, { once: true });
            });
        }, 'player-activated');
        await expect(this.page).toHaveURL(this.fullURI);
        console.log(`Will visit URL: ${this.page.url()}`);
        this.player = await waitPlayerActivationPromise;
        console.log("Player object.. ", typeof this.player.get);
        await this.waitForPlayerContainer();

        // Will set player after our container will be visible
        // await this._setPlayer();
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
        await this.page.waitForSelector(playerContentSelector);
        const videoElementContainer = await this.page.locator(playerContentSelector);
        await expect(videoElementContainer).toBeVisible();
        this.playerContainer = videoElementContainer;
    }

    async waitForAdStarted() {
        await this.page.waitForSelector('div#player[data-adsplaying="true"]', {
            timeout: 2_000 // for 2 seconds
        });
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
            // .boundingBox()
        } else {
            throw new Error("Player container is not set");
        }
    }
}

export default PlayerPage;

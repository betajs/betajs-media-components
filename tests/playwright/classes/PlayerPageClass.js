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
        await this.page.goto(this.fullURI);
        await expect(this.page).toHaveURL(this.fullURI);
        console.log(`Will visit URL: ${this.page.url()}`);
        await this.waitForPlayerContainer();
        // Will set player after our container will be visible
        await this._setPlayer();
    }

    async _setPlayer() {
        // await page.evaluate(eventName => {
        //     return new Promise(callback => document.addEventListener(eventName, callback, { once: true }));
        // }, 'player-ready');
        // this.player = await this.page.evaluate(async () => {
        //     return window.BetaJSPlayer;
        // });
        // this.player = await this.page.evaluate('player');
        this.player = this.page.evaluate((player) => {
            console.log("Now event will be ", player);
        }, 'player');
        console.log("Instance: ", typeof this.player.get);
    }

    async waitForPlayerContainer() {
        await this.page.waitForSelector(playerContentSelector);
        const videoElementContainer = await this.page.locator(playerContentSelector);
        await expect(videoElementContainer).toBeVisible();
        this.playerContainer = videoElementContainer;
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
